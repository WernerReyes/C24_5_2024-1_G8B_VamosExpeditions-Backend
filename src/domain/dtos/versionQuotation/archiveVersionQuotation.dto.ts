import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/versionQuotationID.dto";

export class ArchiveVersionQuotationDto extends VersionQuotationIDDto {
  constructor(
    public readonly id: {
      versionNumber: number;
      quotationId: number;
    },
    public readonly deleteReason?: string
  ) {
    super(id);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, ArchiveVersionQuotationDto?] {
    const { deleteReason, id } = props;

    const [idError, idValidated] = VersionQuotationIDDto.create(id);
    if (idError) return [idError];

    if (deleteReason) {
      const error = Validations.validateStringFields({
        deleteReason,
      });
      if (error) return [error];
    }

    return [
      undefined,
      new ArchiveVersionQuotationDto(
        idValidated?.versionQuotationId!,
        deleteReason
      ),
    ];
  }
}
