import { Validations } from "@/core/utils";

export class PaginationDto {
  constructor(
    public readonly page?: number,
    public readonly limit?: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, PaginationDto?] {
    const { page = 1 , limit = 5 } = props;
    
    const errorNumber = Validations.validateNumberFields({ page, limit });
    if (errorNumber) return [errorNumber];
    return [
      undefined,
      new PaginationDto(page < 1 ? 1 : +page, +limit < 5 ? 5 : +limit),
    ];
  }
}
