import {
  ClientModel,
  type IRoleModel,
  type IUserModel,
  PartnerModel,
  ReservationModel,
  RoleModel,
  ServiceModel,
  ServiceTypeModel,
  UserModel,
  VersionQuotationModel,
} from "@/infrastructure/models";
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
            case "role":
              return !RoleModel.getString.includes(
                field.trim() as keyof IRoleModel
              );

            case "user":
              return !UserModel.getString.includes(
                field.trim() as keyof IUserModel
              );

            case "service":
              return !ServiceModel.getString.includes(
                field.trim() as keyof ServiceModel
              );

            case "service_type":
              return !ServiceTypeModel.getString.includes(
                field.trim() as keyof ServiceTypeModel
              );

            case "version_quotation":
              return !VersionQuotationModel.getString.includes(
                field.trim() as keyof VersionQuotationModel
              );

            case "reservation":
              return !ReservationModel.getString.includes(
                field.trim() as keyof ReservationModel
              );
            case "client":
              return !ClientModel.getString().includes(
                field.trim() as keyof ClientModel
              );
            case "partner":
              return !PartnerModel.getString.includes(
                field.trim() as keyof PartnerModel
              );

            default:
              return [false];
          }
        });

        if (invalidFields.length > 0) {
          return [
            `Invalid fields: ${invalidFields.join(
              ", "
            )}, the valid fields are: ${this.getCorrectModelAtributes(
              modelName
            ).join(", ")}`,
            undefined,
          ];
        }
      }

      return [undefined, new SelectModelFieldsDto(selectArray)];
    }
  }

  private static getCorrectModelAtributes(modelName: Model): string[] {
    switch (modelName) {
      case "role":
        return RoleModel.getString as string[];

      case "user":
        return UserModel.getString as string[];

      case "service":
        return ServiceModel.getString as string[];

      case "service_type":
        return ServiceTypeModel.getString as string[];

      case "version_quotation":
        return VersionQuotationModel.getString as string[];

      case "reservation":
        return ReservationModel.getString as string[];

      default:
        return [];
    }
  }
}
