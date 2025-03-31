import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/versionQuotationID.dto";

/* import { VersionQuotationIDDto } from "../common/versionQuotationID.dto"; */

export class DuplicateVersionQuotationDto extends VersionQuotationIDDto {
  private constructor(
    public readonly id: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly userId: number
  ) {
    super(id);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, DuplicateVersionQuotationDto?] {
    const { userId, id } = props;

    const [error, dto] = VersionQuotationIDDto.create(id);
    if (error) return [error, undefined];

    const emptyFieldsError = Validations.validateEmptyFields(
      { userId },
      "DuplicateVersionQuotationDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      userId,
    });
    if (numberError) return [numberError, undefined];

    return [
      undefined,
      new DuplicateVersionQuotationDto(dto?.versionQuotationId!, +userId),
    ];
  }
}
