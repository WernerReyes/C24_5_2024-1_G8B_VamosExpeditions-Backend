import { ServiceTypeModel } from "@/infrastructure/models";
import { PaginationDto } from "../common/pagination.dto";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";
import { Validations } from "@/core/utils";

export class GetServiceTypesDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly select?: string[]
  ) {
    super(page, limit);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, GetServiceTypesDto?] {
    const { page, limit, select } = props;

    console.log(props);
   
    const [pagError, pagDto] = PaginationDto.create({ page, limit });
    if (pagError) return [pagError, undefined];

    const [dtoError, selectDto] = SelectModelFieldsDto.create(
      ServiceTypeModel.modelName,
      select,
    );
    if (dtoError) return [dtoError, undefined];

    return [
      undefined,
      new GetServiceTypesDto(pagDto!.page!, pagDto!.limit!, selectDto?.select),
    ];
  }
}
