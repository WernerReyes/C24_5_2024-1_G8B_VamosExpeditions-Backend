import { Validations } from "@/core/utils";

export class InsertManyHotelRoomTripDetailsDto {
  private constructor(
    public readonly hotelRoomId: number,
    public readonly tripDetailsId: number,
    public readonly dateRange: [Date, Date],
    public readonly numberOfPeople: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, InsertManyHotelRoomTripDetailsDto?] {
    const { hotelRoomId, tripDetailsId, dateRange, numberOfPeople } =
      props as InsertManyHotelRoomTripDetailsDto;

    const emptyFieldsError = Validations.validateEmptyFields(
      { hotelRoomId, numberOfPeople, dateRange, tripDetailsId },
      "InsertManyHotelRoomTripDetailsDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      hotelRoomId,
      numberOfPeople,
      tripDetailsId,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        hotelRoomId,
        numberOfPeople,
        tripDetailsId,
      },
      0
    );
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new InsertManyHotelRoomTripDetailsDto(
        +hotelRoomId,
        +tripDetailsId,
        [new Date(dateRange[0]), new Date(dateRange[1])],
        +numberOfPeople
      ),
    ];
  }
}
