import { ApiResponse, PaginatedResponse } from "../response";
import { UserEntity } from "@/domain/entities";
import type {
  ChangePasswordDto,
  GetUsersDto,
  TrashDto,
  UserDto,
} from "@/domain/dtos";
import { UserMapper } from "./user.mapper";
import { CustomError } from "@/domain/error";
import { BcryptAdapter } from "@/core/adapters";
import {
  type IUserModel,
  SettingKeyEnum,
  SettingModel,
  UserModel,
} from "@/infrastructure/models";
import type { UserMailer } from "./user.mailer";

export class UserService {

  constructor(
    private readonly userMapper: UserMapper,
    private readonly userMailer: UserMailer
  ) {}

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
            UserEntity.fromObject(user)
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
      const ramdowPassword = BcryptAdapter.generateRandomPassword();
      user = await UserModel.create({
        data: this.userMapper.createUser(ramdowPassword),
        include: this.userMapper.toInclude,
      })
        .then((user) => {
          SettingModel.create({
            data: {
              key: SettingKeyEnum.MAX_ACTIVE_SESSIONS,
              value: "3",
              user_id: user.id_user,
            },
          });
          return user;
        })
        .catch((error) => {
          if (error.code === "P2002") {
            throw CustomError.badRequest("El correo ya está en uso");
          }
          throw error;
        });

      this.userMailer.sendWelcomeEmail({
        email: user.email,
        username: user.fullname,
        password: ramdowPassword,
      });
    }

    return new ApiResponse<UserEntity>(
      200,
      "Usuario guardado correctamente",
      await UserEntity.fromObject(user)
    );
  }

  public async trashUser({ id, deleteReason }: TrashDto) {
    const user = await UserModel.findUnique({
      where: {
        id_user: id,
      },
      select: {
        version_quotation: {
          select: {
            quotation_id: true,
            version_number: true,
          },
        },
        id_user: true,
        is_deleted: true,
      },
    });
    if (!user) throw CustomError.notFound("Usuario no encontrado");
    if (user.version_quotation.length > 0) {
      throw CustomError.badRequest(
        "No se puede eliminar el usuario porque tiene cotizaciones asociadas"
      );
    }

    const userUpdated = await UserModel.update({
      where: {
        id_user: id,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
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

  public restoreUser(id: UserEntity["id"]) {
    return this.trashUser({ id, deleteReason: undefined });
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
