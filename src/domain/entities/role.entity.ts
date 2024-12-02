import { Validations } from "@/core/utils";
import { CustomError } from "../error";

export enum RoleEnum {
  MANAGER_ROLE = "MANAGER_ROLE",
  EMPLOYEE_ROLE = "EMPLOYEE_ROLE",
}

export class RoleEntity {
  private constructor(public id: number, public name: RoleEnum) {}

  public static fromObject(object: { [key: string]: any }): RoleEntity {
    const { id_role, name } = object;

    const error = Validations.validateEmptyFields(object);
    if (error) throw CustomError.badRequest(error);

    const errorRole = Validations.validateEnumValue(
      name,
      Object.values(RoleEnum)
    );
    if (errorRole) throw CustomError.badRequest(errorRole);

    return new RoleEntity(id_role, name);
  }
}
