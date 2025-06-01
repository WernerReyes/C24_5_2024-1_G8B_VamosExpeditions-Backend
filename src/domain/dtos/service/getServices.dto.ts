import { ServiceModel } from "@/infrastructure/models";
import { PaginationDto } from "../common/pagination.dto";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";
import { Validations } from "@/core/utils";

export class GetServicesDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,

    public readonly districtId?: number,

    public readonly select?: string[]
  ) {
    super(page, limit);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, GetServicesDto?] {
    const {
      page,
      limit,

      districtId,

      select,
    } = props;

    const [error, dto] = SelectModelFieldsDto.create(
      ServiceModel.modelName,
      select
    );
    if (error) {
      return [error, undefined];
    }

    const [errorPag, dtoPag] = PaginationDto.create({ page, limit });
    if (errorPag) {
      return [errorPag, undefined];
    }

    if (districtId) {
      const errorNumber = Validations.validateNumberFields({ districtId });
      if (errorNumber) return [errorNumber, undefined];

      const greaterThanZero = Validations.validateGreaterThanValueFields({
        districtId,
      }, 0)
      if (greaterThanZero) return [greaterThanZero, undefined]
    }

    return [
      undefined,
      new GetServicesDto(
        dtoPag!.page!,
        dtoPag!.limit!,

        districtId ? + districtId : undefined,

        dto?.select
      ),
    ];
  }
}
