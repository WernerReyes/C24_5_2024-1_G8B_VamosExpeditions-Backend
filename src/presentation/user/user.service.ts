import { UserModel } from "@/data/postgres";
import { ApiResponse } from "../response";
import { type User, UserEntity } from "@/domain/entities";
import type { ChangePasswordDto, UserDto } from "@/domain/dtos";
import { UserMapper } from "./user.mapper";
import { CustomError } from "@/domain/error";
import { BcryptAdapter } from "@/core/adapters";

export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  public async getUsers() {
    const users = await UserModel.findMany();
    return new ApiResponse<UserEntity[]>(
      200,
      "Usuarios encontrados",
      await Promise.all(users.map((user) => UserEntity.fromObject(user)))
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
      await UserEntity.fromObject(user)
    );
  }

  public async changePassword(changePassword: ChangePasswordDto) {
    const user = await UserModel.findUnique({
      where: {
        id_user: changePassword.id,
      },
    });

    if (!user) throw CustomError.notFound("Usuario no encontrado");

    //* Compare the password with the current password
    const isPasswordValid = await BcryptAdapter.compare(
      changePassword.oldPassword,
      user.password
    );
    if (!isPasswordValid)
      throw CustomError.unauthorized("Contraseña incorrecta");

    //* Compare the password with the new password
    if (changePassword.newPassword === changePassword.oldPassword) {
      throw CustomError.badRequest(
        "La nueva contraseña no puede ser igual a la actual"
      );
    }

    this.userMapper.setDto = changePassword;

    const userUpdated = await UserModel.update({
      where: {
        id_user: changePassword.id,
      },
      data: this.userMapper.changePassword,
    });

    return new ApiResponse<UserEntity>(
      200,
      "Contraseña actualizada",
      await UserEntity.fromObject(userUpdated)
    );
  }
}
