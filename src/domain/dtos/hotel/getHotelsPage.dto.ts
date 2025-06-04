import { Validations } from "@/core/utils";
import { PaginationDto } from "../common/pagination.dto";

export class GetHotelsPageDto extends PaginationDto {
  public constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly name?: string,
    public readonly distrit?: string,
    public readonly category?: string,
    public readonly isDeleted?: boolean,
  ) {
    super(page, limit);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, GetHotelsPageDto?] {
    const { page, limit, name, distrit, category,isDeleted } = props;

    const [error, paginationDto] = PaginationDto.create({ page, limit });
    if (error) return [error];

    if (name) {
      const stringError = Validations.validateStringFields({ name });
      if (stringError) return [stringError];
    }

    if (distrit) {
      const stringError = Validations.validateStringFields({ distrit });
      if (stringError) return [stringError];
    }

    if (category) {
      const numberError = Validations.validateStringFields({ category });
      if (numberError) return [numberError];
    }
    if (isDeleted) {
      const errorIsDeleted = Validations.validateBooleanFields({ isDeleted });
      if (errorIsDeleted) return [errorIsDeleted, undefined];
    }
    return [
      undefined,
      new GetHotelsPageDto(
        paginationDto!.page!,
        paginationDto!.limit!,
        name,
        distrit,
        category,
        isDeleted ? isDeleted === "true" : undefined
      ),
    ];
  }
}

