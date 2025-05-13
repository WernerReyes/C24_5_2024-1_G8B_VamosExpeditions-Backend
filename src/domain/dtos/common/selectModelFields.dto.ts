import { RoleModel, UserModel } from "@/infrastructure/models";
import type { Prisma } from "@prisma/client";

type Model = Prisma.ModelName;

export class SelectModelFieldsDto {
  private constructor(public readonly select?: string[]) {}

  public static create(
    modelName: Model,
    select?: string
  ): [string?, SelectModelFieldsDto?] {
    {
      const selectArray = select?.split(",");
      if (selectArray) {
        const invalidFields = selectArray.filter((field: string) => {
          switch (modelName) {
            case "user":
              UserModel.role = RoleModel.instance;
              return !UserModel.getString().includes(
                field.trim() as keyof UserModel
              );

            case "reservation":
              return !UserModel.getString().includes(
                field.trim() as keyof UserModel
              );

            default:
              return [false];
          }
        });

        if (invalidFields.length > 0) {
          return [`Invalid fields: ${invalidFields.join(", ")}`, undefined];
        }
      }

      return [undefined, new SelectModelFieldsDto(selectArray)];
    }
  }
}
