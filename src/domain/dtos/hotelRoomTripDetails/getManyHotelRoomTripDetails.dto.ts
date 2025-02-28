import { Validations } from "@/core/utils";

export class GetManyHotelRoomTripDetailsDto {
  constructor(public readonly tripDetailsId?: number) {}

  static create(props: {
    [key: string]: any;
  }): [string?, GetManyHotelRoomTripDetailsDto?] {
    const { tripDetailsId } = props;

    if (tripDetailsId) {
      const numberError = Validations.validateNumberFields({
        tripDetailsId,
      });
      if (numberError) return [numberError, undefined];
    }

    return [
      undefined,
      new GetManyHotelRoomTripDetailsDto(+tripDetailsId || undefined),
    ];
  }
}
