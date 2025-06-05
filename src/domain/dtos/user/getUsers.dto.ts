import { UserModel } from "@/infrastructure/models";
import { SelectModelFieldsDto } from "../common/selectModelFields.dto";
import { PaginationDto } from "../common/pagination.dto";
import { RoleEnum } from "@/infrastructure/models";
import { Validations } from "@/core/utils";
import { DateAdapter } from "@/core/adapters";

export class GetUsersDto extends PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly fullname?: string,
    public readonly email?: string,
    public readonly phoneNumber?: string,
    public readonly role?: RoleEnum,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted?: boolean,
    public readonly select?: string[]
  ) {
    super(page, limit);
  }

  public static create(props: { [key: string]: any }): [string?, GetUsersDto?] {
    const {
      select,
      page,
      limit,
      fullname,
      email,
      phoneNumber,
      role,
      createdAt,
      updatedAt,
      isDeleted
    } = props;

    const [error, dto] = SelectModelFieldsDto.create(
      UserModel.modelName,
      select
    );
    if (error) {
      return [error, undefined];
    }

    const [errorPag, dtoPag] = PaginationDto.create({ page, limit });
    if (errorPag) {
      return [errorPag, undefined];
    }

    if (fullname) {
      const errorFullName = Validations.validateStringFields({ fullname });
      if (errorFullName) return [errorFullName, undefined];
    }

    if (email) {
      const errorEmail = Validations.validateStringFields({ email });
      if (errorEmail) return [errorEmail, undefined];
    }

    if (phoneNumber) {
      const errorPhoneNumber = Validations.validateStringFields({
        phoneNumber,
      });
      if (errorPhoneNumber) return [errorPhoneNumber, undefined];
    }

    if (role) {
      const errorRole = Validations.validateEnumValue(
        role,
        Object.values(RoleEnum)
      );
      if (errorRole) return [errorRole, undefined];
    }

    if (createdAt) {
      const errorCreatedAt = Validations.validateDateFields({ createdAt });
      if (errorCreatedAt) return [errorCreatedAt, undefined];
    }

    if (updatedAt) {
      const errorUpdatedAt = Validations.validateDateFields({ updatedAt });
      if (errorUpdatedAt) return [errorUpdatedAt, undefined];
    }

    if (isDeleted) {
      const errorIsDeleted = Validations.validateBooleanFields({ isDeleted });
      if (errorIsDeleted) return [errorIsDeleted, undefined];
    }

   

    return [
      undefined,
      new GetUsersDto(
        dtoPag!.page!,
        dtoPag!.limit!,
        fullname,
        email,
        phoneNumber,
        role,
        createdAt ? DateAdapter.startOfDay(createdAt) : undefined,
        updatedAt ? DateAdapter.startOfDay(updatedAt) : undefined,
        isDeleted ? isDeleted === "true" : undefined,
        dto?.select
      ),
    ];
  }
}
