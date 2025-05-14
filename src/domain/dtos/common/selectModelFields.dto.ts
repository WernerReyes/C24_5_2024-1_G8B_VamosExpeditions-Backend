import {
  CityModel,
  ClientModel,
  QuotationModel,
  ReservationModel,
  RoleModel,
  TripDetailsHasCityModel,
  TripDetailsModel,
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
            case "user":
              this.setUser();
              return !UserModel.getString.includes(
                field.trim() as keyof UserModel
              );

            case "version_quotation":
              this.setVersionQuotation();
              return !VersionQuotationModel.getString([
                "version_quotation.quotation.version_quotation",
              ]).includes(field.trim() as keyof VersionQuotationModel);

            case "reservation":
              this.setReservation();
              return !ReservationModel.getString.includes(
                field.trim() as keyof ReservationModel
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
      case "user":
        return UserModel.getString as string[];

      case "version_quotation":
        return VersionQuotationModel.getString() as string[];

      case "reservation":
        return ReservationModel.getString as string[];

      default:
        return [];
    }
  }

  private static setUser() {
    // UserModel.setRole = RoleModel.partialInstance;
  }

  private static setVersionQuotation() {
    // TripDetailsModel.setClient = ClientModel.partialInstance;

    // QuotationModel.setVersionQuotation = [
    //   VersionQuotationModel.partialInstance,
    // ];
    // QuotationModel.setReservation = ReservationModel.partialInstance;

    // VersionQuotationModel.setTripDetails = TripDetailsModel.partialInstance;
    // VersionQuotationModel.setUser = UserModel.partialInstance;
    // VersionQuotationModel.setQuotation = QuotationModel.partialInstance;
  }

  private static setReservation() {
    // TripDetailsHasCityModel.setCity = CityModel.partialInstance;

    // TripDetailsModel.setTripDetailsHasCity = [
    //   TripDetailsHasCityModel.partialInstance,
    // ];
    // TripDetailsModel.setClient = ClientModel.partialInstance;

    // VersionQuotationModel.setTripDetails = TripDetailsModel.partialInstance;
    // VersionQuotationModel.setUser = UserModel.partialInstance;

    // QuotationModel.setVersionQuotation = [
    //   VersionQuotationModel.partialInstance,
    // ];

    // ReservationModel.setQuotation = QuotationModel.partialInstance;
  }
}

