import { UserModel } from "@/data/postgres";
import { ApiResponse } from "../response";
import { type User, UserEntity } from "@/domain/entities";
import type { UserDto } from "@/domain/dtos";
import { UserMapper } from "./user.mapper";

export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  public async getUsers() {
    const users = await UserModel.findMany();
    return new ApiResponse<UserEntity[]>(
      200,
      "Usuarios encontrados",
      users.map(UserEntity.fromObject)
    );
  }

  public async upsertUser(userDto: UserDto) {
    this.userMapper.setDto = userDto;

    let user: User;
    const existingUser = await UserModel.findUnique({
      where: {
        id_user: userDto.id,
      },
    });
    if (existingUser) {
      user = await UserModel.update({
        where: {
          id_user: userDto.id,
        },
        data: this.userMapper.updateUser,
        include: this.userMapper.toInclude,
      });
    } else {
      user = await UserModel.create({
        data: this.userMapper.createUser,
        include: this.userMapper.toInclude,
      });
    }

    return new ApiResponse<UserEntity>(
      200,
      "Usuario guardado correctamente",
      UserEntity.fromObject(user)
    );
  }
}
