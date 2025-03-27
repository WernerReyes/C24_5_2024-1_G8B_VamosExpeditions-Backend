import { BcryptAdapter } from "@/core/adapters";
import { UserDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";

type Dto = UserDto;
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
    };
  }

  public get updateUser(): Prisma.userUncheckedUpdateInput {
    this.dto = this.dto as UserDto;
    return {
      id_user: this.dto.id,
      fullname: this.dto.fullname,
      email: this.dto.email,
    };
  }

  public get toInclude(): Prisma.userInclude {
    return {
      role: true,
    };
  }
  
}
