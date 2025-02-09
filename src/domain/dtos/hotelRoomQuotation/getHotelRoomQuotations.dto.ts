import { VersionQuotationIDDto } from "../common/VersionQuotationID.dto";

export class GetHotelRoomQuotationsDto extends VersionQuotationIDDto {
  constructor(
    public readonly versionQuotationId?: {
      quotationId: number;
      versionNumber: number;
    }
  ) {
    super(versionQuotationId);
  }

  static create(props: {
    [key: string]: any;
  }): [string?, GetHotelRoomQuotationsDto?] {
    const { quotationId, versionNumber } = props;

    const [error, dto] = VersionQuotationIDDto.create(
      {
        quotationId,
        versionNumber,
      },
      true
    );
    if (error) return [error, undefined];

    return [undefined, new GetHotelRoomQuotationsDto(dto?.versionQuotationId)];
  }
}
