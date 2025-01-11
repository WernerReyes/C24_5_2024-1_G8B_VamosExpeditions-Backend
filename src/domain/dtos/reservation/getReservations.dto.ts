import { Validations } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";

export class GetReservationsDto {
  constructor(public readonly status?: ReservationStatus) {}

  static create(props: { [key: string]: any }): [string?, GetReservationsDto?] {
    const { status } = props;

    if (status) {
      const errorStatus = Validations.validateEnumValue(
        status,
        Object.values(ReservationStatus)
      );
      if (errorStatus) return [errorStatus, undefined];
    }

    return [undefined, new GetReservationsDto(status)];
  }
}
