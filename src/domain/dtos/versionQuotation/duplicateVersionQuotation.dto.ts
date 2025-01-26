import { Validations } from "@/core/utils";

export class DuplicateVersionQuotationDto {
  private constructor(
    public readonly id: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly userId: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, DuplicateVersionQuotationDto?] {
    const { userId, id } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { userId, id },
      "DuplicateVersionQuotationDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      quotationId: id.quotationId,
      versionNumber: id.versionNumber,
      userId,
    });
    if (numberError) return [numberError, undefined];

    return [
      undefined,
      new DuplicateVersionQuotationDto(
        {
          quotationId: +id.quotationId,
          versionNumber: +id.versionNumber,
        },
        +userId
      ),
    ];
  }
}
