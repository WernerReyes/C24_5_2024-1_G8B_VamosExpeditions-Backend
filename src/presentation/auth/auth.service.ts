import { EnvsConst } from "@/core/constants";
import {
  DisconnectDeviceDto,
  LoginDto,
  ResetPasswordDto,
  Verify2FAAndAuthenticateUserDto,
  Verify2FAEmailAndAuthenticateUserDto,
} from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import { SettingKeyEnum, UserModel } from "@/infrastructure/models";
import { BcryptAdapter, JwtAdapter } from "../../core/adapters";
import { ApiResponse } from "../response";
import { AuthContext, AuthUser } from "./auth.context";
import type { AuthMailer } from "./auth.mailer";

import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { DataParserUtil } from "@/core/utils";
import { AuthSocket } from "./auth.socket";

export class AuthService {
  static instance: AuthService;
  constructor(private readonly authMailer: AuthMailer) {
    AuthService.instance = this;
  }

  private test2FA = true;
  public async login(loginDto: LoginDto) {
    const user = await UserModel.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        role: true,
        settings_settings_user_idTouser: true,
      },
    });
    if (!user) throw CustomError.notFound("Correo o contraseña incorrectos");

    //* Compare password
    const passwordMatch = BcryptAdapter.compare(
      loginDto.password,
      user.password
    );
    if (!passwordMatch)
      throw CustomError.unauthorized("Correo o contraseña incorrectos");

    const twoFactorAuth = user.settings_settings_user_idTouser.find(
      (setting) => setting.key === SettingKeyEnum.TWO_FACTOR_AUTH
    )?.value === "true";

    if (twoFactorAuth) {
      //* Generate temporary token
      const tempToken = (await JwtAdapter.generateToken(
        {
          id: user.id_user,
          deviceId: loginDto.device.id,
        },
        "10Min"
      )) as string;
      if (!tempToken)
        throw CustomError.internalServer("Error generating token");

      return new ApiResponse<{ require2FA: boolean; tempToken: string }>(
        200,
        "Usuario autenticado",
        {
          require2FA: true,
          tempToken,
        }
      );
    }

    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: user.id_user,
      deviceId: loginDto.device.id,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    //* Save user in redis
    await AuthContext.authenticateUser({
      id: user.id_user,
      role: user.role.name,
      device: loginDto.device,
    });

    return new ApiResponse<{
      user: UserEntity;
      token: string;
      deviceId: string;
    }>(200, "Usuario autenticado", {
      user: await UserEntity.fromObject({
        ...user,
        showDevices: true,
      }),
      token,
      deviceId: loginDto.device.id,
    });
  }

  public async sendResetPasswordEmail(email: string) {
    const user = await UserModel.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    const token = await JwtAdapter.generateToken(
      {
        id: user.id_user,
      },
      "10Min"
    );
    if (!token) throw CustomError.internalServer("Error generating token");

    await this.authMailer
      .sendEmailForResetPassword(
        email,
        user.fullname,
        `${EnvsConst.CLIENT_URL}/reset-password/${token}`
      )
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        throw CustomError.internalServer("Error al enviar el correo");
      });

    return new ApiResponse<void>(
      200,
      "Revisa tu correo para restablecer la contraseña",
      undefined
    );
  }

  public async verifyResetPasswordToken(token: string) {
    const decodedToken = await JwtAdapter.verifyToken<{
      id: number;
    }>(token);
    if (!decodedToken) throw CustomError.unauthorized("Token inválido");
    if (!decodedToken.id) throw CustomError.unauthorized("Token inválido");

    return new ApiResponse<void>(200, "Token válido", undefined);
  }

  public async resetPassword({ token, newPassword }: ResetPasswordDto) {
    const decodedToken = await JwtAdapter.verifyToken<{
      id: number;
    }>(token);
    if (!decodedToken) throw CustomError.unauthorized("Token inválido");
    if (!decodedToken.id) throw CustomError.unauthorized("Token inválido");

    await UserModel.update({
      where: {
        id_user: decodedToken.id,
      },
      data: {
        password: BcryptAdapter.hash(newPassword),
      },
    }).catch((error) => {
      if (error.code === "P2025") {
        throw CustomError.notFound("Usuario no encontrado");
      }
      throw CustomError.internalServer("Error al actualizar la contraseña");
    });

    return new ApiResponse<void>(
      200,
      "Contraseña actualizada correctamente",
      undefined
    );
  }

  public async reLogin(userId: UserEntity["id"]) {
    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
      include: {
        role: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: user.id_user,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    return new ApiResponse<{
      user: UserEntity;
      token: string;
    }>(200, "Usuario autenticado", {
      user: await UserEntity.fromObject({
        ...user,
        showDevices: true,
      }),
      token,
    });
  }

  public async generateTwoFactorAuthenticationSecret(userId: UserEntity["id"]) {
    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
      select: {
        twofasecret: true,
        email: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    let secret = {
      base32: user.twofasecret,
      otpauth_url: "",
    };

    if (!secret.base32) {
      const newSecret = speakeasy.generateSecret({
        name: `vamosexpeditios:${user.email}`,
      });

      await UserModel.update({
        where: {
          id_user: userId,
        },
        data: {
          twofasecret: newSecret.base32,
        },
      });

      secret = {
        base32: newSecret.base32,
        otpauth_url: newSecret.otpauth_url || "",
      };
    } else {
      secret = {
        base32: user.twofasecret,
        otpauth_url: `otpauth://totp/vamosexpeditios:${user.email}?secret=${user.twofasecret}&issuer=vamosexpeditios`,
      };
    }

    const qrCodeImageUrl = await qrcode.toDataURL(secret.otpauth_url || "");

    return new ApiResponse<{
      qrCodeImageUrl: string;
      email: string;
      userId: UserEntity["id"];
    }>(200, "Secret generated", {
      userId: userId,
      qrCodeImageUrl,
      email: DataParserUtil.maskEmail(user.email),
    });
  }

  public async verify2FAAndAuthenticateUser({
    userId,
    code,
    device,
  }: Verify2FAAndAuthenticateUserDto) {
    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
      include: {
        role: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    const verified = speakeasy.totp.verify({
      secret: user.twofasecret || "",
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) throw CustomError.unauthorized("Código incorrecto");
    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: user.id_user,
      deviceId: device.id,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    //* Save user in redis
    await AuthContext.authenticateUser({
      id: user.id_user,
      role: user.role.name,
      device,
    });

    return new ApiResponse<{
      user: UserEntity;
      token: string;
      deviceId: string;
    }>(200, "Usuario autenticado", {
      user: await UserEntity.fromObject({
        ...user,
        showDevices: true,
      }),
      token,
      deviceId: device.id,
    });
  }

  public async sendEmailToVerify2FA(token: string, userId: UserEntity["id"]) {
    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    const url = `${EnvsConst.CLIENT_URL}/verify-2fa-email/${token}`;

    await this.authMailer
      .sendEmailForVerify2FA(user.email, user.fullname, url)
      .catch(() => {
        throw CustomError.internalServer("Error al enviar el correo");
      });

    return new ApiResponse<void>(
      200,
      "Revisa tu correo para verificar tu cuenta",
      undefined
    );
  }

  public async verify2FAEmail(deviceId: string) {
    await AuthSocket.instance.confirm2FASocket(deviceId);
  }

  public async setTokenFrom2FAEmail({
    device,
    userId,
  }: Verify2FAEmailAndAuthenticateUserDto) {
    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
      include: {
        role: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: user.id_user,
      deviceId: device.id,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    //* Save user in redis
    await AuthContext.authenticateUser({
      id: userId,
      role: user.role.name,
      device,
    });

    return new ApiResponse<{
      user: UserEntity;
      token: string;
      deviceId: string;
    }>(200, "Usuario autenticado", {
      user: await UserEntity.fromObject({
        ...user,
        showDevices: true,
      }),
      token,
      deviceId: device.id,
    });
  }

  public async userAuthenticated(userId: UserEntity["id"]) {
    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
        settings: true,
        settings_settings_user_idTouser: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");
    return new ApiResponse<{
      user: UserEntity;
    }>(200, "Usuario autenticado", {
      user: await UserEntity.fromObject(user),
    });
  }

  public async disconnectDevice(disconnectDeviceDto: DisconnectDeviceDto) {
    const { userId, deviceId, password } = disconnectDeviceDto;

    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
      select: {
        password: true,
      },
    });

    if (!user) throw CustomError.notFound("Usuario no encontrado");

    //* Compare password
    const passwordMatch = BcryptAdapter.compare(password, user.password);
    if (!passwordMatch) throw CustomError.unauthorized("Contraseña incorrecta");

    //* Deauthenticate user
    await AuthContext.disconnectDevice(userId, deviceId);

    return new ApiResponse<null>(
      200,
      "Dispositivo desconectado correctamente",
      null
    );
  }
  public async logout(authUser: AuthUser) {
    //* Deauthenticate user
    AuthContext.deauthenticateUser(authUser);

    return new ApiResponse<null>(
      200,
      "Usuario deslogueado correctamente",
      null
    );
  }
}
