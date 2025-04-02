import { BcryptAdapter, JwtAdapter } from "../../core/adapters";
import { UserModel } from "@/data/postgres";
import { LoginDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import { ApiResponse } from "../response";

export class AuthService {
  constructor() {}

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


    return new ApiResponse<{
      user: UserEntity;
      token: string;
    }>(200, "Usuario autenticado", {
      user: UserEntity.fromObject(user),
      token,
    });
  }

  public async reLogin(user: UserEntity) {
    //* Generate token
    const token = (await JwtAdapter.generateToken({
      id: user.id,
    })) as string;
    if (!token) throw CustomError.internalServer("Error generating token");

    return new ApiResponse<{
      user: UserEntity;
      token: string;
    }>(200, "Usuario autenticado", {
      user,
      token,
    });
  }

  public async logout() {
    return new ApiResponse<null>(
      200,
      "Usuario deslogueado correctamente",
      null
    );
  }
}
