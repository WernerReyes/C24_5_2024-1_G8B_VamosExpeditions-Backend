import { Validations } from "@/core/utils";

export class RoomDto {
  constructor(
    
    public roomType: string,
    public season: string,
    public hotelName: string,
    public priceUsd: number,
    public serviceTax: number,
    public rateUsd: number,
    public pricePen: number
  ) {}

  static create(props: { [key: string]: any }): [string?, RoomDto?] {
    const {
      roomType,
      season,
      hotelName,
      priceUsd,
      serviceTax,
      rateUsd,
      pricePen,
    } = props;

    const error = Validations.validateEmptyFields(
      { roomType, season, hotelName, priceUsd, serviceTax, rateUsd, pricePen },
      "RoomDto"
    );
    if (error) return [error, undefined];

    return [
      undefined,
      new RoomDto(
        roomType,
        season,
        hotelName,
        priceUsd,
        serviceTax,
        rateUsd,
        pricePen
      ),
    ];
  }
}
