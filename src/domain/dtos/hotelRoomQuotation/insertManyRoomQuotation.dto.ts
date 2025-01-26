import { Validations } from "@/core/utils";

export class InsertManyHotelRoomQuotationsDto {
  private constructor(
    public readonly hotelRoomId: number,
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly dayRange: [number, number],
    public readonly numberOfPeople: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, InsertManyHotelRoomQuotationsDto?] {
    const { hotelRoomId, versionQuotationId, dayRange, numberOfPeople } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { hotelRoomId, versionQuotationId, dayRange, numberOfPeople },
      "InsertManyHotelRoomQuotationsDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      hotelRoomId,
      quotationId: versionQuotationId.quotationId,
      versionNumber: versionQuotationId.versionNumber,
      firtValue: dayRange[0],
      secondValue: dayRange[1],
      numberOfPeople,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        hotelRoomId,
        quotationId: versionQuotationId.quotationId,
        versionNumber: versionQuotationId.versionNumber,
        numberOfPeople,
        firstValue: dayRange[0],
        secondValue: dayRange[1],
      },
      0
    );
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new InsertManyHotelRoomQuotationsDto(
        +hotelRoomId,
        {
          quotationId: +versionQuotationId.quotationId,
          versionNumber: +versionQuotationId.versionNumber,
        },
        [+dayRange[0], +dayRange[1]],
        +numberOfPeople
      ),
    ];
  }
}
