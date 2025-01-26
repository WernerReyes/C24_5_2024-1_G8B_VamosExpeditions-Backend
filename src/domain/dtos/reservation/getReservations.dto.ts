import { Validations } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";

export class GetReservationsDto {
  constructor(
    public readonly status?: ReservationStatus,
    public readonly versionQuotationId?: {
      quotationId: number;
      versionNumber: number;
    }
  ) {}

  static create(props: { [key: string]: any }): [string?, GetReservationsDto?] {
    const {
      status,
      quotationId,
      versionNumber,
    } = props;

    if (status) {
      const errorStatus = Validations.validateEnumValue(
        status,
        Object.values(ReservationStatus)
      );
      if (errorStatus) return [errorStatus, undefined];
    }

    if ((quotationId && !versionNumber) || (versionNumber && !quotationId)) {
      return [
        "quotationId and versionNumber must be provided together",
        undefined,
      ];
    }

    if (quotationId) {
      const errorQuotationId = Validations.validateNumberFields({
        quotationId,
      });
      if (errorQuotationId) return [errorQuotationId, undefined];
    }

    if (versionNumber) {
      const errorVersionNumber = Validations.validateNumberFields({
        versionNumber,
      });
      if (errorVersionNumber) return [errorVersionNumber, undefined];
    }

    return [
      undefined,
      new GetReservationsDto(
        status,
        quotationId &&
          versionNumber ? {
            quotationId: +quotationId,
            versionNumber: +versionNumber,
          } : undefined
      ),
    ];
  }
}
