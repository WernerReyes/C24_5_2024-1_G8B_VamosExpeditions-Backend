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
    console.log(object);

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

// model user {
//     id_user  Int    @id @default(autoincrement())
//     fullname String @db.VarChar(45)
//     email    String @db.VarChar(45)
//     password String @db.VarChar(45)
//     id_rol   Int
//     role     role   @relation(fields: [id_rol], references: [id_role], onDelete: NoAction, onUpdate: NoAction, map: "fk_usuario_rol")
//   }
