import { ParamsUtils, Validations } from "@/core/utils";
import { PaginationDto } from "../common/pagination.dto";
import { VersionQuotationStatus } from "@/domain/entities";

export class GetVersionQuotationsDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly name?: string,
    public readonly clientsIds?: number[],
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly status?: VersionQuotationStatus[],
    public readonly representativesIds?: number[],
    public readonly quotationId?: number,
    public readonly official?: boolean
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

    

    return [
      undefined,
      new GetVersionQuotationsDto(
        paginationDto!.page!,
        paginationDto!.limit!,
        name === "null" ? undefined : name,
        clientsIds ? ParamsUtils.parseArray(clientsIds) : undefined,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        status ? ParamsUtils.parseArray(status) : undefined,
        representativesIds
          ? ParamsUtils.parseArray(representativesIds)
          : undefined,
        quotationId ? Number(quotationId) : undefined,
        official
          ? official === "true"
            ? true
            : false
          : undefined
      ),
    ];
  }
}
