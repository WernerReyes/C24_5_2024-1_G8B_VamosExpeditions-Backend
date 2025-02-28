import { Validations } from "@/core/utils";
import {
  ReservationStatus
} from "@/domain/entities";

const FROM = "ReservationDto";
export class ReservationDto {
  private constructor(
    public readonly tripDetailsId: number,
    public readonly status: ReservationStatus,
    public readonly id?: number
  ) {}

  static create(props: { [key: string]: any }): [string?, ReservationDto?] {
    const { tripDetailsId, status, id = 0 } = props;

    // Validar campos vacíos
    const error = Validations.validateEmptyFields(
      {
        tripDetailsId,
        status,
      },
      FROM
    );
    if (error) return [error, undefined];

    const errorNumber = Validations.validateNumberFields({
      tripDetailsId,
    });
    if (errorNumber) return [errorNumber, undefined];

    const errorStatus = Validations.validateEnumValue(
      status,
      Object.values(ReservationStatus)
    );
    if (errorStatus) return [errorStatus, undefined];

    if (id !== 0) {
      const errorId = Validations.validateNumberFields({ id });
      if (errorId) return [errorId, undefined];
    }

    return [undefined, new ReservationDto(+tripDetailsId, status, id)];
  }
}
