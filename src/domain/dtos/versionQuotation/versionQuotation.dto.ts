import { Validations } from "@/core/utils";
import { QuotationStatus } from "@/domain/entities";
import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class VersionQuotationDto extends VersionQuotationIDDto {
  private constructor(
    public readonly id: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly name: string = `Q-${new Date().getFullYear()}-${id}`, // Q-2025-1
    public readonly status: QuotationStatus = QuotationStatus.DRAFT,
    public readonly official: boolean = false,
    public readonly indirectCostMargin?: number,
    public readonly profitMargin?: number,
    public readonly totalCost?: number,
    public readonly finalPrice?: number,
    public readonly reservationId?: number
  ) {
    super(id);
  }

  static create(props: {
    [key: string]: any;
  }): [string?, VersionQuotationDto?] {
    const {
      status = QuotationStatus.DRAFT,
      official = false,
      indirectCostMargin,
      profitMargin,
      totalCost,
      finalPrice,
      reservationId,
      name,
      id,
    } = props;

    const [idError, idDto] = VersionQuotationIDDto.create(id);
    if (idError) return [idError, undefined];

    const statusError = Validations.validateEnumValue(
      status,
      Object.values(QuotationStatus)
    );
    if (statusError) return [statusError, undefined];

    if (official) {
      const officialError = Validations.validateBooleanFields({ official });
      if (officialError) return [officialError, undefined];
    }

    if (indirectCostMargin) {
      const indirectCostMarginError = Validations.validateNumberFields({
        indirectCostMargin,
      });
      if (indirectCostMarginError) return [indirectCostMarginError, undefined];
    }

    if (profitMargin) {
      const profitMarginError = Validations.validateNumberFields({
        profitMargin,
      });
      if (profitMarginError) return [profitMarginError, undefined];
    }

    if (totalCost) {
      const totalCostError = Validations.validateNumberFields({ totalCost });
      if (totalCostError) return [totalCostError, undefined];
    }

    if (finalPrice) {
      const finalPriceError = Validations.validateNumberFields({ finalPrice });
      if (finalPriceError) return [finalPriceError, undefined];
    }

    if (reservationId) {
      const reservationIdError = Validations.validateNumberFields({
        reservationId,
      });
      if (reservationIdError) return [reservationIdError, undefined];
    }

    return [
      undefined,
      new VersionQuotationDto(
        idDto?.versionQuotationId!,
        name,
        status,
        official,
        +indirectCostMargin,
        +profitMargin,
        +totalCost,
        +finalPrice,
        +reservationId
      ),
    ];
  }
}
