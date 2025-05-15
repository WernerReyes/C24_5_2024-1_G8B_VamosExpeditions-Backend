import { ApiResponse, PaginatedResponse } from "../response";
import { UserEntity } from "@/domain/entities";
import type { ChangePasswordDto, GetUsersDto, TrashDto, UserDto } from "@/domain/dtos";
import { UserMapper } from "./user.mapper";
import { CustomError } from "@/domain/error";
import { BcryptAdapter } from "@/core/adapters";
import { type IUserModel, UserModel } from "@/infrastructure/models";

export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  public async getUsers(getUsersDto: GetUsersDto) {
    const { page, limit } = getUsersDto;
    this.userMapper.setDto = getUsersDto;

    const users = await UserModel.findMany({
      select: this.userMapper.toSelect,
      where: this.userMapper.filters,
      orderBy: {
        created_at: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalUsers = await UserModel.count({
      where: this.userMapper.filters,
    });

    return new ApiResponse<PaginatedResponse<UserEntity>>(
      200,
      "Usuarios encontrados",
      new PaginatedResponse(
        await Promise.all(
          users.map((user) =>
            UserEntity.fromObject({
              ...user,
              showDevices: getUsersDto.showDevices,
            })
          )
        ),
        page,
        Math.ceil(totalUsers / limit),
        totalUsers,
        limit
      )
    );
  }

  public async upsertUser(userDto: UserDto) {
    this.userMapper.setDto = userDto;

    let user: IUserModel;
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

  public async toogleTrash({ id, deleteReason }: TrashDto) {
    const user = await UserModel.findUnique({
      where: {
        id_user: id,
      },
      select: {
        id_user: true,
        is_deleted: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");

    const userUpdated = await UserModel.update({
      where: {
        id_user: id,
      },
      data: {
        delete_reason: user.is_deleted ? null : deleteReason,
        is_deleted: !user.is_deleted,
        deleted_at: user.is_deleted ? null : new Date(),
      },
    });

    return new ApiResponse<UserEntity>(
      200,
      user.is_deleted
        ? "Usuario restaurado correctamente"
        : "Usuario eliminado correctamente",
      await UserEntity.fromObject(userUpdated)
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
