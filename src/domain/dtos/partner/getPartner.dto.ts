import { PartnerModel } from "@/infrastructure/models";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";
import { PaginationDto } from "../common/pagination.dto";
import { Validations } from "@/core/utils";
import { DateAdapter } from "@/core/adapters";

export class GetPartnersDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly name?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
    public readonly isDeleted?: boolean,
    public readonly deleteReason?: string,
    public readonly select?: string[]
  ) {
    super(page, limit);
  }

  public static create(props: { [key: string]: any }): [string?, GetPartnersDto?] {
    const {
      select,
      page,
      limit,
      name,
      createdAt,
      updatedAt,
      deletedAt,
      isDeleted,
      deleteReason
    } = props;

    const [error, dto] = SelectModelFieldsDto.create(PartnerModel.modelName, select);
    if (error) return [error];

    const [errorPag, dtoPag] = PaginationDto.create({ page, limit });
    if (errorPag) return [errorPag];

    if (name) {
      const errorName = Validations.validateStringFields({ name });
      if (errorName) return [errorName];
    }

    if (deleteReason) {
      const errorReason = Validations.validateStringFields({ deleteReason });
      if (errorReason) return [errorReason];
    }

    if (createdAt) {
      const errorCreatedAt = Validations.validateDateFields({ createdAt });
      if (errorCreatedAt) return [errorCreatedAt];
    }

    if (updatedAt) {
      const errorUpdatedAt = Validations.validateDateFields({ updatedAt });
      if (errorUpdatedAt) return [errorUpdatedAt];
    }

    if (deletedAt) {
      const errorDeletedAt = Validations.validateDateFields({ deletedAt });
      if (errorDeletedAt) return [errorDeletedAt];
    }

    if (isDeleted !== undefined) {
      const errorIsDeleted = Validations.validateBooleanFields({ isDeleted });
      if (errorIsDeleted) return [errorIsDeleted];
    }

    return [
      undefined,
      new GetPartnersDto(
        dtoPag!.page!,
        dtoPag!.limit!,
        name,
        createdAt ? DateAdapter.startOfDay(createdAt) : undefined,
        updatedAt ? DateAdapter.startOfDay(updatedAt) : undefined,
        deletedAt ? DateAdapter.startOfDay(deletedAt) : undefined,
        isDeleted ? isDeleted === "true" : undefined,
        deleteReason,
        dto?.select
      ),
    ];
  }
}
