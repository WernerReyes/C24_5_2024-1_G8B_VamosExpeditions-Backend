import { Validations } from "@/core/utils";

export class InsertManyDetailsTripDetailsDto {
  private constructor(
    public readonly id: number, //* hotelRoomId || serviceId
    public readonly tripDetailsId: number,
    public readonly dateRange: [Date, Date],
    public readonly countPerDay: number,
    public readonly costPerson: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, InsertManyDetailsTripDetailsDto?] {
    const { id, tripDetailsId, dateRange, countPerDay, costPerson } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { id, costPerson, dateRange, tripDetailsId, countPerDay },
      "InsertManyDetailsTripDetailsDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      id,
      costPerson,
      tripDetailsId,
      countPerDay,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        id,
        costPerson,
        tripDetailsId,
      },
      0
    );
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new InsertManyDetailsTripDetailsDto(
        +id,
        +tripDetailsId,
        [new Date(dateRange[0]), new Date(dateRange[1])],
        +countPerDay < 1 ? 1 : +countPerDay,
        +costPerson
      ),
    ];
  }
}
