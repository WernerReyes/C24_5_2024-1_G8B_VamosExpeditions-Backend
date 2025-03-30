import { Validations } from "@/core/utils";
import { VersionQuotationStatus } from "@/domain/entities";
import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class VersionQuotationDto extends VersionQuotationIDDto {
  private constructor(
    public readonly id: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly name: string = `Q-${new Date().getFullYear()}-${
      id.quotationId
    }`, // Q-2025-1
    public readonly status: VersionQuotationStatus = VersionQuotationStatus.DRAFT,
    public readonly completionPercentage: number,
    public readonly indirectCostMargin?: number,
    public readonly profitMargin?: number,
    public readonly finalPrice?: number
  ) {
    super(id);
  }

  static create(props: {
    [key: string]: any;
  }): [string?, VersionQuotationDto?] {
    const {
      status = VersionQuotationStatus.DRAFT,
      indirectCostMargin,
      profitMargin,
      finalPrice,
      name,
      completionPercentage,
      id,
    } = props;

    const [idError, idDto] = VersionQuotationIDDto.create(id);
    if (idError) return [idError, undefined];

    const statusError = Validations.validateEnumValue(
      status,
      Object.values(VersionQuotationStatus)
    );
    if (statusError) return [statusError, undefined];

    
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


    if (finalPrice) {
      const finalPriceError = Validations.validateNumberFields({ finalPrice });
      if (finalPriceError) return [finalPriceError, undefined];
    }


    if ([0, 25, 50, 75, 100].indexOf(+completionPercentage) === -1)
      return [
        "El porcentaje de completitud debe ser 0, 25, 50 o 100",
        undefined,
      ];

    return [
      undefined,
      new VersionQuotationDto(
        idDto?.versionQuotationId!,
        name,
        status,
        +completionPercentage,
        +indirectCostMargin,
        +profitMargin,
        +finalPrice
      ),
    ];
  }
}
