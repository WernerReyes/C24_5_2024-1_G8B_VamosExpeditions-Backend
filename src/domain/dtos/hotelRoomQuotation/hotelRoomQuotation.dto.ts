import { Validations } from "@/core/utils";

export class HotelRoomQuotationDto {
  private constructor(
    public readonly hotelRoomId: number,
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly day: number,
    public readonly numberOfPeople: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, HotelRoomQuotationDto?] {
    const { hotelRoomId, versionQuotationId, day, numberOfPeople } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { hotelRoomId, versionQuotationId, day, numberOfPeople },
      "HotelRoomQuotationDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      hotelRoomId,
      quotationId: versionQuotationId.quotationId,
      versionNumber: versionQuotationId.versionNumber,
      day,
      numberOfPeople,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields({
      hotelRoomId,
      quotationId: versionQuotationId.quotationId,
      versionNumber: versionQuotationId.versionNumber,
      day,
      numberOfPeople,
    }, 0);
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new HotelRoomQuotationDto(
        +hotelRoomId,
        {
          quotationId: +versionQuotationId.quotationId,
          versionNumber: +versionQuotationId.versionNumber,
        },
        +day,
        +numberOfPeople
      ),
    ];
  }
}
