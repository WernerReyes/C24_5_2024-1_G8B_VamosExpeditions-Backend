import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/versionQuotationID.dto";
import { AllowVersionQuotationType } from "@/infrastructure/models";

export class SendEmailAndGenerateReportDto extends VersionQuotationIDDto {
  constructor(
    public readonly subject: string,
    public readonly to: string[],
    public readonly resources: AllowVersionQuotationType,
    public readonly from: string,
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly description?: string
  ) {
    super(versionQuotationId);
  }

  static create(props: {
    [key: string]: any;
  }): [string?, SendEmailAndGenerateReportDto?] {
    const { subject, to, resources, description, from, versionQuotationId } =
      props;

    const [idError, idDtoValidated] =
      VersionQuotationIDDto.create(versionQuotationId);
    if (idError) return [idError, undefined];

    const error = Validations.validateEmptyFields({
      subject,
      to,
      from,
      resources,
    });
    if (error) return [error, undefined];

    const emailError = Validations.validateArrayEmail([to, from]);
    if (emailError) return [emailError, undefined];

    const resourceError = Validations.validateEnumValue(
      resources,
      Object.values(AllowVersionQuotationType)
    );
    if (resourceError) return [resourceError, undefined];

    return [
      undefined,
      new SendEmailAndGenerateReportDto(
        subject,
        to,
        resources,
        from,
        idDtoValidated!.versionQuotationId!,
        description
      ),
    ];
  }
}
