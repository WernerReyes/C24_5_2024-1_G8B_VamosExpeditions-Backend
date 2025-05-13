import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/versionQuotationID.dto";
import { VersionQuotationStatusEnum } from "@/infrastructure/models";

export class VersionQuotationDto extends VersionQuotationIDDto {
  private constructor(
    public readonly id: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly name: string = `Q-${new Date().getFullYear()}-${
      id.quotationId
    }`, // Q-2025-1
    public readonly status: VersionQuotationStatusEnum = VersionQuotationStatusEnum.DRAFT,
    public readonly completionPercentage: number,
    public readonly partnerId?: number,
    public readonly commission?: number,
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
      status = VersionQuotationStatusEnum.DRAFT,
      indirectCostMargin,
      profitMargin,
      finalPrice,
      name,
      partnerId,
      completionPercentage,
      commission,
      id,
    } = props;

    const [idError, idDto] = VersionQuotationIDDto.create(id);
    if (idError) return [idError, undefined];

    const statusError = Validations.validateEnumValue(
      status,
      Object.values(VersionQuotationStatusEnum)
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

    if (commission) {
      const commissionError = Validations.validateNumberFields({ commission });
      if (commissionError) return [commissionError, undefined];
      if (commission < 3 || commission > 20)
        return ["La comisión no puede ser menor a 3% o mayor a 20%", undefined];
    }

    if ([0, 25, 50, 75, 100].indexOf(+completionPercentage) === -1)
      return [
        "El porcentaje de completitud debe ser 0, 25, 50 o 100",
        undefined,
      ];

    if (partnerId) {
      const parnerIdError = Validations.validateNumberFields({ partnerId });
      if (parnerIdError) return [parnerIdError, undefined];
    }

    return [
      undefined,
      new VersionQuotationDto(
        idDto?.versionQuotationId!,
        name,
        status,
        +completionPercentage,
        partnerId ? +partnerId : undefined,
        commission ? +commission : undefined,
        indirectCostMargin ? +indirectCostMargin : undefined,
        profitMargin ? +profitMargin : undefined,
        finalPrice ? +finalPrice : undefined
      ),
    ];
  }
}
