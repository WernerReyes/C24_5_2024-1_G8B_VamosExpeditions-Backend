import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class UpdateManyHotelRoomQuotationsByDateDto extends VersionQuotationIDDto {
  private constructor(
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly startDate: Date
  ) {
    super(versionQuotationId);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, UpdateManyHotelRoomQuotationsByDateDto?] {
    const { versionQuotationId, startDate } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { startDate },
      "UpdateManyHotelRoomQuotationsByDateDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const [error, dto] = VersionQuotationIDDto.create(versionQuotationId);
    if (error) return [error, undefined];

    const dateError = Validations.validateDateFields({ startDate });
    if (dateError) return [dateError, undefined];

    return [
      undefined,
      new UpdateManyHotelRoomQuotationsByDateDto(
        dto?.versionQuotationId!,
        new Date(startDate)
      ),
    ];
  }
}
