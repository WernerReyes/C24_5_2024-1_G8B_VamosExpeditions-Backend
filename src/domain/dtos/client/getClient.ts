import { ClientModel } from "@/infrastructure/models";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";
import { PaginationDto } from "../common/pagination.dto";
import { Validations } from "@/core/utils";
import { DateAdapter } from "@/core/adapters";

export class GetClientsDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly fullName?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly subregion?: string,
    public readonly country?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted?: boolean,
    public readonly select?: string[]
  ) {
    super(page, limit);
  }

  public static create(props: { [key: string]: any }): [string?, GetClientsDto?] {
    const {
      select,
      page,
      limit,
      fullName,
      email,
      phone,
      subregion,
      country,
      createdAt,
      updatedAt,
      isDeleted
    } = props;

    const [errorSelect, dto] = SelectModelFieldsDto.create(ClientModel.modelName, select);
    if (errorSelect) return [errorSelect, undefined];

    const [errorPag, dtoPag] = PaginationDto.create({ page, limit });
    if (errorPag) return [errorPag, undefined];

    if (fullName) {
      const errorFullName = Validations.validateStringFields({ fullName });
      if (errorFullName) return [errorFullName, undefined];
    }

    if (email) {
      const errorEmail = Validations.validateStringFields({ email });
      if (errorEmail) return [errorEmail, undefined];
    }

    if (phone) {
      const errorPhone = Validations.validateStringFields({ phone });
      if (errorPhone) return [errorPhone, undefined];
    }

    if (subregion) {
      const errorSubregion = Validations.validateStringFields({ subregion });
      if (errorSubregion) return [errorSubregion, undefined];
    }

    if (country) {
      const errorCountry = Validations.validateStringFields({ country });
      if (errorCountry) return [errorCountry, undefined];
    }

    if (createdAt) {
      const errorCreatedAt = Validations.validateDateFields({ createdAt });
      if (errorCreatedAt) return [errorCreatedAt, undefined];
    }

    if (updatedAt) {
      const errorUpdatedAt = Validations.validateDateFields({ updatedAt });
      if (errorUpdatedAt) return [errorUpdatedAt, undefined];
    }

    if (isDeleted) {
      const errorIsDeleted = Validations.validateBooleanFields({ isDeleted });
      if (errorIsDeleted) return [errorIsDeleted, undefined];
    }

    return [
      undefined,
      new GetClientsDto(
        dtoPag!.page!,
        dtoPag!.limit!,
        fullName,
        email,
        phone,
        subregion,
        country,
        createdAt ? DateAdapter.startOfDay(createdAt) : undefined,
        updatedAt ? DateAdapter.startOfDay(updatedAt) : undefined,
        isDeleted ? isDeleted === "true" : undefined,
        dto?.select
      ),
    ];
  }
}
