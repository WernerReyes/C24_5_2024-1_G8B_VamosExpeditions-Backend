import { ServiceModel } from "@/infrastructure/models";
import { PaginationDto } from "../common/pagination.dto";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";
import { Validations } from "@/core/utils";

export class GetServicesDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly cityId?: number,
    public readonly serviceTypeId?: number,
    public readonly description?: string,
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
      description,
      cityId,
      serviceTypeId,

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

    if (cityId) {
      const errorNumber = Validations.validateNumberFields({ cityId });
      if (errorNumber) return [errorNumber, undefined];

      const greaterThanZero = Validations.validateGreaterThanValueFields(
        {
          cityId,
        },
        0
      );
      if (greaterThanZero) return [greaterThanZero, undefined];
    }

    if (serviceTypeId) {
      const errorNumber = Validations.validateNumberFields({ serviceTypeId });
      if (errorNumber) return [errorNumber, undefined];

      const greaterThanZero = Validations.validateGreaterThanValueFields(
        {
          serviceTypeId,
        },
        0
      );
    }

    return [
      undefined,
      new GetServicesDto(
        dtoPag!.page!,
        dtoPag!.limit!,
        cityId ? +cityId : undefined,
        serviceTypeId ? +serviceTypeId : undefined,
        description ? description.trim() : undefined,
        dto?.select
      ),
    ];
  }
}
