import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class DeleteManyHotelRoomQuotationsByDateDto extends VersionQuotationIDDto {
  private constructor(
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly date: Date
  ) {
    super(versionQuotationId);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, DeleteManyHotelRoomQuotationsByDateDto?] {
    const { quotationId, versionNumber, date } = props;

    const emptyFieldsError = Validations.validateEmptyFields(
      { date },
      "DeleteManyHotelRoomQuotationsByDateDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const [error, dto] = VersionQuotationIDDto.create({
      quotationId,
      versionNumber,
    });
    if (error) return [error, undefined];

    const dateError = Validations.validateDateFields({ date });
    if (dateError) return [dateError, undefined];

    return [
      undefined,
      new DeleteManyHotelRoomQuotationsByDateDto(
        dto?.versionQuotationId!,
        new Date(date)
      ),
    ];
  }
}
