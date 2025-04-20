import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/versionQuotationID.dto";

export class ArchiveVersionQuotationDto extends VersionQuotationIDDto {
  constructor(
    public readonly id: {
      versionNumber: number;
      quotationId: number;
    },
    public readonly archiveReason?: string,
    public readonly official?: boolean
  ) {
    super(id);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, ArchiveVersionQuotationDto?] {
    const { archiveReason, id, official } = props;

    const [idError, idValidated] = VersionQuotationIDDto.create(id);
    if (idError) return [idError];

    if (archiveReason) {
      const error = Validations.validateStringFields({
        archiveReason,
      });
      if (error) return [error];
    }

    if (official) {
      const error = Validations.validateBooleanFields({ official });
      if (error) return [error];
    }

    return [
      undefined,
      new ArchiveVersionQuotationDto(
        idValidated?.versionQuotationId!,
        archiveReason,
        official ? (official === "false" ? false : undefined) : undefined
      ),
    ];
  }
}
