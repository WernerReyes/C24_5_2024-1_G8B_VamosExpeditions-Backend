import { Validations } from "@/core/utils";

export class RoomDto {
  constructor(
    public roomId: number,
    public roomType: string,
    public seasonType: string,
    public hotelId: number,
    public priceUsd: number,
    public serviceTax: number,
    public rateUsd: number,
    public capacity: number,
    public pricePen: number
  ) {}

  static create(props: { [key: string]: any }): [string?, RoomDto?] {
    
    const {
      roomId = 0,
      roomType,
       seasonType,
      hotelId,
      priceUsd,
      serviceTax,
      rateUsd,
      pricePen,
      capacity,
    } = props;

    // Validar campos vacíos
    const error = Validations.validateEmptyFields(
      { roomType, seasonType, hotelId, priceUsd, serviceTax, rateUsd, pricePen, capacity },
      "RoomDto"
    );
    if (error) return [error, undefined];

    // Validar roomId si se envía
    if (roomId !== 0) {
      const idError = Validations.validateNumberFields({ roomId });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { roomId },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    // Validar hotelId
    if (hotelId) {
      const idError = Validations.validateNumberFields({ hotelId });
      if (idError) return [idError, undefined];

      const greaterThanError = Validations.validateGreaterThanValueFields(
        { hotelId },
        0
      );
      if (greaterThanError) return [greaterThanError, undefined];
    }

    // Crear instancia RoomDto
    return [
      undefined,
      new RoomDto(
        +roomId,
        roomType,
        seasonType,
        +hotelId,
        +priceUsd,
        +serviceTax,
        +rateUsd,
        +capacity,
        +pricePen
      ),
    ];
  }
}
