import { Validations } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";

const FROM = "ReservationDto";
export class ReservationDto {
  private constructor(
    public readonly quotationId: number,
    public readonly status: ReservationStatus,
    public readonly id?: number
  ) {}

  static create(props: { [key: string]: any }): [string?, ReservationDto?] {
    const { quotationId, status, id = 0 } = props;

    // Validar campos vacíos
    const error = Validations.validateEmptyFields(
      {
        status,
      },
      FROM
    );
    if (error) return [error, undefined];

    const errorQuotationId = Validations.validateNumberFields({
      quotationId
    });
    if (errorQuotationId) return [errorQuotationId, undefined];

    const errorStatus = Validations.validateEnumValue(
      status,
      Object.values(ReservationStatus)
    );
    if (errorStatus) return [errorStatus, undefined];

    if (id !== 0) {
      const errorId = Validations.validateNumberFields({ id });
      if (errorId) return [errorId, undefined];
    }

    return [undefined, new ReservationDto(+quotationId, status, +id)];
  }
}
