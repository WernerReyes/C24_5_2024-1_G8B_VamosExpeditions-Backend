import { Validations } from "@/core/utils";

export class VersionQuotationIDDto {
  constructor(
    public readonly versionQuotationId?: {
      quotationId: number;
      versionNumber: number;
    }
  ) {}

  static create(
    props: {
      [key: string]: any;
    },
    op: boolean = false
  ): [string?, VersionQuotationIDDto?] {
    if (!props) return ["The body is required"];

    const { quotationId, versionNumber } = props;

    if (op) {
      const emptyFieldsError = Validations.validateEmptyFields(
        { quotationId, versionNumber },
        "VersionQuotationIDDto"
      );
      if (emptyFieldsError) return [emptyFieldsError, undefined];

      const numberError = Validations.validateNumberFields({
        quotationId: quotationId,
        versionNumber: versionNumber,
      });
      if (numberError) return [numberError, undefined];

      const greaterThanZeroError = Validations.validateGreaterThanValueFields(
        {
          quotationId: quotationId,
          versionNumber: versionNumber,
        },
        0
      );
      if (greaterThanZeroError) return [greaterThanZeroError, undefined];
    }

    return [
      undefined,
      new VersionQuotationIDDto(
        quotationId && versionNumber
          ? {
              quotationId: +quotationId,
              versionNumber: +versionNumber,
            }
          : undefined
      ),
    ];
  }
}
