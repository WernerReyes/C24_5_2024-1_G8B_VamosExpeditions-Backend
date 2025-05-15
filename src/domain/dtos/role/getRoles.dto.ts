import { Validations } from "@/core/utils";
import { PaginationDto } from "../common/pagination.dto";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";
import { RoleEnum, RoleModel } from "@/infrastructure/models";

export class GetRolesDto {
  constructor(
    public readonly limit: number,
    public readonly page: number,
    public readonly name?: RoleEnum,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted?: boolean,
    public readonly select?: string[]
  ) {}

  static create(props: { [key: string]: any }): [string?, GetRolesDto?] {
    const { page, limit, name, createdAt, isDeleted, updatedAt, select } = props;

    if (name) {
      const error = Validations.validateStringFields({ name });
      if (error) return [error, undefined];
    }

    if (createdAt) {
      const error = Validations.validateDateFields({ createdAt });
      if (error) return [error, undefined];
    }

    if (updatedAt) {
      const error = Validations.validateDateFields({ updatedAt });
      if (error) return [error, undefined];
    }

    const [errorPagination] = PaginationDto.create({
      page,
      limit,
    });
    if (errorPagination) return [errorPagination, undefined];

    if (isDeleted) {
      const error = Validations.validateBooleanFields({ isDeleted });
      if (error) return [error, undefined];
    }

    const [selectError, selectDto] = SelectModelFieldsDto.create(
      RoleModel.modelName,
      select
    );
    if (selectError) return [selectError, undefined];

    return [
      undefined,
      new GetRolesDto(
        +limit,
        +page,
        name,
        createdAt,
        updatedAt,
        isDeleted,
        selectDto?.select
      ),
    ];
  }
}
