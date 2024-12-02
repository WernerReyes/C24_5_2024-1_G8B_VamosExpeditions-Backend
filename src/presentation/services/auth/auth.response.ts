import type { UserEntity } from "@/domain/entities";
import { AppResponse } from "@/presentation/response";

export class AuthResponse {
  login(
    user: UserEntity,
    token: string
  ): AppResponse<{ user: UserEntity; token: string }> {
    return {
      status: 200,
      message: "Usuario logueado correctamente",
      data: { user, token },
    };
  }

  logout(): AppResponse<null> {
    return {
      status: 200,
      message: "Usuario deslogueado correctamente",
      data: null,
    };
  }
}
