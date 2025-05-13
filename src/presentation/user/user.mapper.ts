import { ParamsUtils } from "@/core/utils";
import type { ChangePasswordDto, GetUsersDto, UserDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";
import { BcryptAdapter } from "../../core/adapters";

type Dto = UserDto | ChangePasswordDto | GetUsersDto;
export class UserMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toSelect(): Prisma.userSelect | undefined {
    const { select } = this.dto as GetUsersDto;
    if (!select) return this.select;

    return ParamsUtils.parseDBSelect(select);
  }

  private get select(): Prisma.userSelect {
    return {
      id_user: true,
      fullname: true,
      email: true,
      password: true,
      created_at: true,
      updated_at: true,
      is_deleted: true,
      description: true,
      phone_number: true,
      id_role: true,
      deleted_at: true,
      delete_reason: true,
      role: true,
    };
  }

  public get filters(): Prisma.userWhereInput {
    this.dto = this.dto as GetUsersDto;
    return {
      fullname: this.dto.fullname
        ? { contains: this.dto.fullname, mode: "insensitive" }
        : undefined,
      email: this.dto.email
        ? { contains: this.dto.email, mode: "insensitive" }
        : undefined,
      phone_number: this.dto.phoneNumber
        ? { contains: this.dto.phoneNumber }
        : undefined,
      role: this.dto.role ? { name: this.dto.role } : undefined,
      created_at: this.dto.createdAt
        ? { gte: new Date(this.dto.createdAt) }
        : undefined,
      updated_at: this.dto.updatedAt
        ? { gte: new Date(this.dto.updatedAt) }
        : undefined,
    };
  }

  public get createUser(): Prisma.userUncheckedCreateInput {
    this.dto = this.dto as UserDto;
    return {
      id_user: this.dto.id,
      fullname: this.dto.fullname,
      email: this.dto.email,
      password: BcryptAdapter.hash(this.dto.password!),
      id_role: this.dto.roleId!,
      phone_number: this.dto.phoneNumber,
      description: this.dto.description,
    };
  }

  public get updateUser(): Prisma.userUncheckedUpdateInput {
    this.dto = this.dto as UserDto;
    return {
      id_user: this.dto.id,
      fullname: this.dto.fullname,
      email: this.dto.email,
      phone_number: this.dto.phoneNumber,
      description: this.dto.description,
    };
  }

  public get changePassword(): Prisma.userUncheckedUpdateInput {
    this.dto = this.dto as ChangePasswordDto;
    return {
      password: BcryptAdapter.hash(this.dto.newPassword),
    };
  }

  public get toInclude(): Prisma.userInclude {
    return {
      role: true,
    };
  }
}
