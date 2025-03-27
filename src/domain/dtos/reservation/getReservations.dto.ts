import { ReservationStatus } from "@/domain/entities";
import { PaginationDto } from "../common/pagination.dto";
import { VersionQuotationIDDto } from "../common/versionQuotationID.dto";
import { ParamsUtils, Validations } from "@/core/utils";

export class GetReservationsDto extends PaginationDto {
  constructor(
    public readonly limit: number,
    public readonly page: number,
    public readonly status?: ReservationStatus[],
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
        createdAt ? new Date(createdAt) : undefined,
        updatedAt ? new Date(updatedAt) : undefined
      ),
    ];
  }
}
