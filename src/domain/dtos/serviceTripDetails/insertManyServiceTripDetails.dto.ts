import { Validations } from "@/core/utils";

export class InsertManyServiceTripDetailsDto {
  private constructor(
    public readonly serviceId: number,
    public readonly tripDetailsId: number,
    public readonly dateRange: [Date, Date],
    public readonly countPerDay: number,
    public readonly costPerson: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, InsertManyServiceTripDetailsDto?] {
    const { serviceId, tripDetailsId, dateRange, costPerson, countPerDay } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { serviceId, tripDetailsId, dateRange, costPerson, countPerDay },
      "InsertManyServiceTripDetailsDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      serviceId,
      tripDetailsId,
      costPerson,
      countPerDay
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        serviceId,
        tripDetailsId,
        costPerson,
        countPerDay
      },
      0
    );
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new InsertManyServiceTripDetailsDto(
        serviceId,
        tripDetailsId,
        [new Date(dateRange[0]), new Date(dateRange[1])],
        countPerDay,
        costPerson
      ),
    ];
  }
}