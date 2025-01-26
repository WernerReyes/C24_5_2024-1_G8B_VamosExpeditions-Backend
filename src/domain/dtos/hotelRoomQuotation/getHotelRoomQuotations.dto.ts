import { Validations } from "@/core/utils";

export class GetHotelRoomQuotationsDto {
  constructor(
    public readonly versionQuotationId?: {
      quotationId: number;
      versionNumber: number;
    }
  ) {}

  static create(props: {
    [key: string]: any;
  }): [string?, GetHotelRoomQuotationsDto?] {
    const { quotationId, versionNumber } = props;

    if (quotationId && versionNumber) {
      const numberError = Validations.validateNumberFields({
        quotationId: quotationId,
        versionNumber: versionNumber,
      });
      if (numberError) return [numberError, undefined];
    }

    return [
      undefined,
      new GetHotelRoomQuotationsDto(
        quotationId && versionNumber
          ? {
              quotationId: +quotationId,
              versionNumber: +versionNumber,
            }
          : undefined
      ),
    ];
  }
}
