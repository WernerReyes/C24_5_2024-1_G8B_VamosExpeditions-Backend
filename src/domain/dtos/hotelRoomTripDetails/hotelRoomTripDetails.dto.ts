import { Validations } from "@/core/utils";

export class HotelRoomTripDetailsDto {
  private constructor(
    public readonly hotelRoomId: number,
    public readonly tripDetailsId: number,
    public readonly date: Date,
    public readonly countPerDay: number,
    public readonly numberOfPeople: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, HotelRoomTripDetailsDto?] {
    const { hotelRoomId, tripDetailsId, date, numberOfPeople, countPerDay } =
      props as HotelRoomTripDetailsDto;

    const emptyFieldsError = Validations.validateEmptyFields(
      { hotelRoomId, tripDetailsId, date, numberOfPeople },
      "HotelRoomTripDetailsDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      hotelRoomId,
      tripDetailsId,
      numberOfPeople,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        hotelRoomId,
        tripDetailsId,
        numberOfPeople,
      },
      0
    );
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new HotelRoomTripDetailsDto(
        +hotelRoomId,
        +tripDetailsId,
        new Date(date),
        +countPerDay,
        +numberOfPeople
      ),
    ];
  }
}
