import { BcryptAdapter } from "../../core/adapters";
import type { ChangePasswordDto, UserDto } from "@/domain/dtos";
import type { Prisma } from "@prisma/client";

type Dto = UserDto | ChangePasswordDto;
export class UserMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
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
