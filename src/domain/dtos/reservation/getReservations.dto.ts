import { ReservationStatus } from "@/domain/entities";
import { PaginationDto } from "../common/pagination.dto";
import { ParamsUtils, Validations } from "@/core/utils";
import { DateAdapter } from "@/core/adapters";

export class GetReservationsDto extends PaginationDto {
  constructor(
    public readonly limit: number,
    public readonly page: number,
    public readonly status?: ReservationStatus[],
    public readonly isDeleted?: boolean,
    public readonly quotationName?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    super(limit, page);
  }

  static create(props: { [key: string]: any }): [string?, GetReservationsDto?] {
    const {
      page,
      limit,
      status,
      createdAt,
      updatedAt,
      isDeleted,
      quotationName,
    } = props;

    const [errorPagination, paginationDto] = PaginationDto.create({
      page,
      limit,
    });
    if (errorPagination) return [errorPagination, undefined];

    if (status) {
      const error = Validations.validateEnumValues(
        ParamsUtils.parseArray(status),
        Object.values(ReservationStatus),
        "status"
      );
      if (error) return [error, undefined];
    }

    if (isDeleted) {
      const error = Validations.validateBooleanFields({ isDeleted });
      if (error) return [error, undefined];
    }

    if (quotationName) {
      const error = Validations.validateStringFields({ quotationName });
      if (error) return [error, undefined];
    }

    if (createdAt) {
      const error = Validations.validateDateFields({ createdAt });
      if (error) return [error, undefined];
    }

    if (updatedAt) {
      const error = Validations.validateDateFields({ updatedAt });
      if (error) return [error, undefined];
    }

    return [
      undefined,
      new GetReservationsDto(
        paginationDto!.limit!,
        paginationDto!.page!,
        status ? ParamsUtils.parseArray(status) : undefined,
        isDeleted ? isDeleted === "true" : undefined,
        quotationName,
        createdAt ? DateAdapter.startOfDay(createdAt) : undefined,
        updatedAt ? DateAdapter.startOfDay(updatedAt) : undefined
      ),
    ];
  }
}
