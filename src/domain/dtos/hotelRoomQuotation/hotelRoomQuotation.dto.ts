import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class HotelRoomQuotationDto extends VersionQuotationIDDto {
  private constructor(
    public readonly hotelRoomId: number,
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly date: Date,
    public readonly numberOfPeople: number
  ) {
    super(versionQuotationId!);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, HotelRoomQuotationDto?] {
    const { hotelRoomId, versionQuotationId, date, numberOfPeople } = props;

    const [error, dto] = VersionQuotationIDDto.create(versionQuotationId);
    if (error) return [error, undefined];

    const emptyFieldsError = Validations.validateEmptyFields(
      { hotelRoomId, versionQuotationId, date, numberOfPeople },
      "HotelRoomQuotationDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      hotelRoomId,
      quotationId: versionQuotationId.quotationId,
      versionNumber: versionQuotationId.versionNumber,
      numberOfPeople,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        hotelRoomId,
        quotationId: versionQuotationId.quotationId,
        versionNumber: versionQuotationId.versionNumber,
        numberOfPeople,
      },
      0
    );
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new HotelRoomQuotationDto(
        +hotelRoomId,
        dto?.versionQuotationId!,
        new Date(date),
        +numberOfPeople
      ),
    ];
  }
}
