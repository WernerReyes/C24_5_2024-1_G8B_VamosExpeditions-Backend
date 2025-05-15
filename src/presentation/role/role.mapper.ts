import { ParamsUtils } from "@/core/utils";
import type { GetRolesDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";

type Dto = GetRolesDto;

export class RoleMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toSelect(): Prisma.roleSelect | undefined {
    const { select } = this.dto;
    if (!select) return this.select;

    return ParamsUtils.parseDBSelect(select);
  }

  private get select(): Prisma.roleSelect {
    return {
      id_role: true,
      name: true,
      delete_reason: true,
      deleted_at: true,
      created_at: true,
      updated_at: true,
      is_deleted: true,
    };
  }

  public get filters(): Prisma.roleWhereInput {
    const { createdAt, updatedAt, isDeleted } = this.dto as GetRolesDto;
    return {
      is_deleted: isDeleted,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }
}
