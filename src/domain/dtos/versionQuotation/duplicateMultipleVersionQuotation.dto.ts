import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class DuplicateMultipleVersionQuotationDto {
  private constructor(
    public readonly ids: {
      quotationId: number;
      versionNumber: number;
    }[],
    public readonly userId: number
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, DuplicateMultipleVersionQuotationDto?] {
    const { userId, ids } = props;

    if (!Array.isArray(ids) || ids.length === 0) {
      return ["ids debe ser un array con al menos un elemento", undefined];
    }

    for (const id of ids) {
      const [error] = VersionQuotationIDDto.create(id);
      if (error) return [error, undefined];
    }

    const emptyFieldsError = Validations.validateEmptyFields(
      { userId },
      "DuplicateMultipleVersionQuotationDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      userId,
    });
    if (numberError) return [numberError, undefined];

    return [
      undefined,
      new DuplicateMultipleVersionQuotationDto(
        ids.map((id: { quotationId: number; versionNumber: number }) => ({
          quotationId: Number(id.quotationId),
          versionNumber: Number(id.versionNumber),
        })),
        +userId
      ),
    ];
  }
}
