import type { role, user } from "@prisma/client";
import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import { RoleEntity } from "./role.entity";

export type User = user & {
  role?: role;
};
export class UserEntity {
  private constructor(
    public readonly id: number,
    public readonly fullname: string,
    public readonly email: string,
    public readonly role?: RoleEntity
  ) {}

  public static fromObject(user: User): UserEntity {
    const { id_user, fullname, email, password, role } = user;

    const error = Validations.validateEmptyFields({
      id_user,
      fullname,
      email,
      password,
    }, "UserEntity");
    if (error) throw CustomError.badRequest(error);

    return new UserEntity(
      id_user,
      fullname,
      email,
      role ? RoleEntity.fromObject(role) : undefined
    );
  }
}
