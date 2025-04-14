import { BcryptAdapter, JwtAdapter } from "../../core/adapters";
import { UserModel } from "@/data/postgres";
import { LoginDto, ResetPasswordDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import { ApiResponse } from "../response";
import { AuthContext } from "./auth.context";
import { EmailService } from "@/lib";
import { EnvsConst } from "@/core/constants";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async login(loginDto: LoginDto) {
    const user = await UserModel.findFirst({
      where: {
        email: loginDto.email,
      },
      include: {
        role: true,
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

    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: user.id_user,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    //* Save user in redis
    AuthContext.authenticateUser({
      id: user.id_user,
      role: user.role.name,
    });

    return new ApiResponse<{
      user: UserEntity;
      token: string;
    }>(200, "Usuario autenticado", {
      user: await UserEntity.fromObject(user),
      token,
    });
  }

  public async sendResetPasswordEmail(email: string) {
    const user = await UserModel.findFirst({
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

    await this.emailService
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
      user: await UserEntity.fromObject(user),
      token,
    });
  }

  public async userAuthenticated(userId: UserEntity["id"]) {
    const user = await UserModel.findUnique({
      where: {
        id_user: userId,
      },
      include: {
        role: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    return new ApiResponse<{
      user: UserEntity;
    }>(200, "Usuario autenticado", {
      user: await UserEntity.fromObject(user),
    });
  }

  public async logout(userId: number) {
    //* Deauthenticate user
    AuthContext.deauthenticateUser(userId);

    return new ApiResponse<null>(
      200,
      "Usuario deslogueado correctamente",
      null
    );
  }
}
