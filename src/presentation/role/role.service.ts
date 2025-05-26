import { RoleModel } from "@/infrastructure/models";
import { ApiResponse, PaginatedResponse } from "../response";
import type { GetRolesDto } from "@/domain/dtos";
import { RoleEntity } from "@/domain/entities";
import { RoleMapper } from "./role.mapper";

export class RoleService {
  constructor(
    private readonly roleMapper: RoleMapper 
  ) {}

  public async getAll(getRolesDto: GetRolesDto) {
    this.roleMapper.setDto = getRolesDto;

    const { page, limit } = getRolesDto;
    const offset = (page - 1) * limit;
    const roles = await RoleModel.findMany({
      where: this.roleMapper.filters,
      orderBy: { created_at: "desc" },
      skip: offset,
      take: limit,
      select: this.roleMapper.toSelect,
    });
    
    const totalRoles = await RoleModel.count({
      where: this.roleMapper.filters,
    });
    return new ApiResponse<PaginatedResponse<RoleEntity>>(
      200,
      "Roles retrieved successfully",
      new PaginatedResponse<RoleEntity>(
        roles.map(RoleEntity.fromObject),
        page,
        Math.ceil(totalRoles / limit),
        totalRoles,
        limit
      )
    );
  }
}
