import { DateAdapter } from "@/core/adapters";
import { Validations } from "@/core/utils";


export class InsertManyHotelRoomTripDetailsDto {
  private constructor(
    public readonly hotelRoomId: number,
    public readonly tripDetailsId: number,
    public readonly dateRange: [Date, Date],
    public readonly countPerDay: number,
    public readonly costPerson: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, InsertManyHotelRoomTripDetailsDto?] {
    const {
      hotelRoomId,
      tripDetailsId,
      dateRange,
      countPerDay,
      costPerson,
    } = props as InsertManyHotelRoomTripDetailsDto;

    const emptyFieldsError = Validations.validateEmptyFields(
      { hotelRoomId, costPerson, dateRange, tripDetailsId, countPerDay },
      "InsertManyHotelRoomTripDetailsDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      hotelRoomId,
      costPerson,
      tripDetailsId,
      countPerDay,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        hotelRoomId,
        costPerson,
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
        // [DateUtils.parseISO(dateRange[0]), DateUtils.parseISO(dateRange[1])],
        [new Date(dateRange[0]), new Date(dateRange[1])],
        +countPerDay < 1 ? 1 : +countPerDay,
        +costPerson
      ),
    ];
  }
}
