import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class InsertManyHotelRoomQuotationsDto extends VersionQuotationIDDto {
  private constructor(
    public readonly hotelRoomId: number,
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly dateRange: [Date, Date],
    public readonly numberOfPeople: number
  ) {
    super(versionQuotationId);
  }

  public static create(props: {
    [key: string]: any;
  }): [string?, InsertManyHotelRoomQuotationsDto?] {
    const { hotelRoomId, versionQuotationId, dateRange, numberOfPeople } =
      props;

    const [error, dto] = VersionQuotationIDDto.create(versionQuotationId);
    if (error) return [error, undefined];

    const emptyFieldsError = Validations.validateEmptyFields(
      { hotelRoomId, numberOfPeople, dateRange },
      "InsertManyHotelRoomQuotationsDto"
    );
    if (emptyFieldsError) return [emptyFieldsError, undefined];

    const numberError = Validations.validateNumberFields({
      hotelRoomId,
      numberOfPeople,
    });
    if (numberError) return [numberError, undefined];

    const greaterThanZeroError = Validations.validateGreaterThanValueFields(
      {
        hotelRoomId,
        numberOfPeople,
      },
      0
    );
    if (greaterThanZeroError) return [greaterThanZeroError, undefined];

    return [
      undefined,
      new InsertManyHotelRoomQuotationsDto(
        +hotelRoomId,
        dto?.versionQuotationId!,
        [new Date(dateRange[0]), new Date(dateRange[1])],
        +numberOfPeople
      ),
    ];
  }
}
