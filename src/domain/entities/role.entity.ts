import type { IRoleModel, RoleEnum } from "@/infrastructure/models";

export class RoleEntity {
  constructor(public id: number, public name: RoleEnum) {}

  public static fromObject(role: { [key: string]: any }): RoleEntity {
    const { id_role, name } = role as IRoleModel;
    return new RoleEntity(id_role, name);
  }
}
