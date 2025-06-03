import { DateAdapter } from "@/core/adapters";
import { Validations } from "@/core/utils";

export class UpdateManyDetailsTripDetailsByDateDto {
  private constructor(
    public readonly tripDetailsId: number,
    public readonly startDate: Date
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, UpdateManyDetailsTripDetailsByDateDto?] {
    const { tripDetailsId, startDate } =
      props as UpdateManyDetailsTripDetailsByDateDto;

    const emptyFieldsError = Validations.validateEmptyFields(
      { startDate, tripDetailsId },
      "UpdateManyDetailsTripDetailsByDateDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const dateError = Validations.validateDateFields({ startDate });
    if (dateError) return [dateError, undefined];

    return [
      undefined,
      new UpdateManyDetailsTripDetailsByDateDto(
        +tripDetailsId,
        DateAdapter.startOfDay(startDate)
      ),
    ];
  }
}
