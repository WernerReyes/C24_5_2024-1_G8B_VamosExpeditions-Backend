import { Validations } from "@/core/utils";

export class GetStadisticsDto {
  private constructor(public readonly year?: number) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, GetStadisticsDto?] {
    const { year } = props;

    if (year) {
      const error = Validations.validateNumberFields({ year });
      if (error) return [error, undefined];
    }

    return [undefined, new GetStadisticsDto(year ? +year : undefined)];
  }
}
