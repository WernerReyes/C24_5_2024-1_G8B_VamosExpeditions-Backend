import { type User, UserEntity } from "@/domain/entities";
import { ApiResponse } from "@/presentation/response";

export class AuthResponse {
  login(
    user: User,
    token: string
  ): ApiResponse<{ user: UserEntity; token: string }> {
    return {
      status: 200,
      message: "Usuario logueado correctamente",
      data: { user: UserEntity.fromObject(user), token },
    };
  }

  logout(): ApiResponse<null> {
    return {
      status: 200,
      message: "Usuario deslogueado correctamente",
      data: null,
    };
  }
}
