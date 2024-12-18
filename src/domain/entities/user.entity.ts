import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { RoleEntity } from "./role.entity";
export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly role: RoleEntity
  ) {}

  public static fromObject(object: { [key: string]: any }): UserEntity {
    const { id_user, fullname, email, password, role } = object;

    const error = Validations.validateEmptyFields({
      id_user,
      fullname,
      email,
      password,
      role,
    });
    if (error) throw CustomError.badRequest(error);

    const roleEntity = RoleEntity.fromObject(role);

    return new UserEntity(id_user, fullname, email, roleEntity);
  }
}

