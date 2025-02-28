import { UserModel } from "@/data/postgres";
import { ApiResponse } from "../response";
import { UserEntity } from "@/domain/entities";

export class UserService {
  public async getUsers() {
    const users = await UserModel.findMany();
    return new ApiResponse<UserEntity[]>(
      200,
      "Usuarios encontrados",
      users.map(UserEntity.fromObject)
    );
  }
}
