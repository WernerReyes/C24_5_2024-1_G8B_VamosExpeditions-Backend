import type { IRoleModel, RoleEnum } from "@/infrastructure/models";

export class RoleEntity {
  constructor(
    public readonly id: number,
    public readonly name: RoleEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isDeleted: boolean,
    public readonly deletedAt?: Date,
    public readonly deleteReason?: string
  ) {}

  public static fromObject(role: { [key: string]: any }): RoleEntity {
    const {
      id_role,
      name,
      created_at,
      updated_at,
      is_deleted,
      deleted_at,
      delete_reason,
    } = role as IRoleModel;
    return new RoleEntity(
      id_role,
      name,
      created_at,
      updated_at,
      is_deleted,
      deleted_at ?? undefined,
      delete_reason ?? undefined
    );
  }
}
