import { Validations } from "@/core/utils";

export class UpdateHotelRoomQuotationDayDto {
  constructor(
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly direction: "start" | "middle",
    public readonly dayNumber: number
  ) {}

  static create(props: {
    [key: string]: any;
  }): [string?, UpdateHotelRoomQuotationDayDto?] {
    const { versionQuotationId, direction, dayNumber } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { versionQuotationId, direction },
      "UpdateHotelRoomQuotationDay"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      quotationId: versionQuotationId.quotationId,
      versionNumber: versionQuotationId.versionNumber,
      dayNumber,
    });
    if (numberError) return [numberError, undefined];

    if (direction !== "up" && direction !== "middle")
      return ["Direction must be 'up' or 'middle'", undefined];

    return [
      undefined,
      new UpdateHotelRoomQuotationDayDto(
        {
          quotationId: +versionQuotationId.quotationId,
          versionNumber: +versionQuotationId.versionNumber,
        },
        direction,
        +dayNumber
      ),
    ];
  }
}
