import { Validations } from "@/core/utils";

export class UpdateManyHotelRoomTripDetailsByDateDto {
  private constructor(
    public readonly tripDetailsId: number,
    public readonly startDate: Date
  ) {
  
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, UpdateManyHotelRoomTripDetailsByDateDto?] {
    const { tripDetailsId, startDate } = props as UpdateManyHotelRoomTripDetailsByDateDto;

    const emptyFieldsError = Validations.validateEmptyFields(
      { startDate, tripDetailsId },
      "UpdateManyHotelRoomTripDetailsByDateDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];


    const dateError = Validations.validateDateFields({ startDate });
    if (dateError) return [dateError, undefined];

    return [
      undefined,
      new UpdateManyHotelRoomTripDetailsByDateDto(
        +tripDetailsId,
        new Date(startDate)
      ),
    ];
  }
}
