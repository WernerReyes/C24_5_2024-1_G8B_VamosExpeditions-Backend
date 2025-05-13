import { ParamsUtils, Validations } from "@/core/utils";
import { PaginationDto } from "../common/pagination.dto";
import { DateAdapter } from "@/core/adapters";
import {
  VersionQuotationModel,
  type VersionQuotationStatusEnum,
} from "@/infrastructure/models";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";

export class GetVersionQuotationsDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly name?: string,
    public readonly clientsIds?: number[],
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly status?: VersionQuotationStatusEnum[],
    public readonly representativesIds?: number[],
    public readonly quotationId?: number,
    public readonly official?: boolean,
    public readonly isDeleted?: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,

    public readonly select?: string[]
  ) {
    super(page, limit);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, GetVersionQuotationsDto?] {
    const {
      page,
      limit,
      name,
      clientsIds,
      startDate,
      endDate,
      status,
      representativesIds,
      quotationId,
      official,
      isDeleted,
      createdAt,
      updatedAt,
      select,
    } = props;

    const [error, paginationDto] = PaginationDto.create({ page, limit });
    if (error) return [error];

    if (name) {
      const stringError = Validations.validateStringFields({ name });
      if (stringError) return [stringError];
    }

    if (startDate) {
      const dateError = Validations.validateDateFields({ startDate });
      if (dateError) return [dateError];
    }

    if (endDate) {
      const dateError = Validations.validateDateFields({ endDate });
      if (dateError) return [dateError];
    }

    if (quotationId) {
      const numberError = Validations.validateNumberFields({ quotationId });
      if (numberError) return [numberError];
    }

    if (official) {
      const booleanError = Validations.validateBooleanFields({
        official,
      });
      if (booleanError) return [booleanError];
    }

    if (isDeleted) {
      const booleanError = Validations.validateBooleanFields({
        isDeleted,
      });
      if (booleanError) return [booleanError];
    }

    if (createdAt) {
      const dateError = Validations.validateDateFields({ createdAt });
      if (dateError) return [dateError];
    }

    if (updatedAt) {
      const dateError = Validations.validateDateFields({ updatedAt });
      if (dateError) return [dateError];
    }

    const [selectError, dtoSelect] = SelectModelFieldsDto.create(
      VersionQuotationModel.modelName,
      select
    );
    if (selectError) return [selectError];

    return [
      undefined,
      new GetVersionQuotationsDto(
        paginationDto!.page!,
        paginationDto!.limit!,
        name === "null" ? undefined : name,
        clientsIds ? ParamsUtils.parseArray(clientsIds) : undefined,
        startDate ? DateAdapter.startOfDay(startDate) : undefined,
        endDate ? DateAdapter.startOfDay(endDate) : undefined,
        status ? ParamsUtils.parseArray(status) : undefined,
        representativesIds
          ? ParamsUtils.parseArray(representativesIds)
          : undefined,
        quotationId ? Number(quotationId) : undefined,
        official ? official === "true" : undefined,
        isDeleted ? isDeleted === "true" : undefined,
        createdAt ? DateAdapter.startOfDay(createdAt) : undefined,
        updatedAt ? DateAdapter.startOfDay(updatedAt) : undefined,
        dtoSelect?.select
      ),
    ];
  }
}
