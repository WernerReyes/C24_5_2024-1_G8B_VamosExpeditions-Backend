import { Validations } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";

export class GetReservationsDto {
  constructor(
  
    public readonly versionQuotationId?: {
      quotationId: number;
      versionNumber: number;
    }
  ) {}

  static create(props: { [key: string]: any }): [string?, GetReservationsDto?] {
    const {
  
      quotationId,
      versionNumber,
    } = props;

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
        quotationId &&
          versionNumber ? {
            quotationId: +quotationId,
            versionNumber: +versionNumber,
          } : undefined
      ),
    ];
  }
}
