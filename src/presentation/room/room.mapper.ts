import { Validations } from "@/core/utils";
import { RoomDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";


type Dto = RoomDto;

const FROM = "RoomMapper";
export class RoomMapper {
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get createRoom(): Prisma.hotel_roomUncheckedCreateInput {
    this.validateModelInstance(this.dto, "createRoom");
    this.dto = this.dto as RoomDto;
    return {
      hotel_id: this.dto.hotelId,
      capacity: this.dto.capacity,
      price_pen: this.dto.pricePen,
      price_usd: this.dto.priceUsd,
      room_type: this.dto.roomType,
      season_type: this.dto.seasonType,
      service_tax: this.dto.serviceTax,
      rate_usd: this.dto.rateUsd,
    };
  }

  public get updateRoom(): Prisma.hotel_roomUncheckedUpdateInput {
    this.validateModelInstance(this.dto, "updateRoom");
    this.dto = this.dto as RoomDto;
    return {
      hotel_id: this.dto.hotelId,
      capacity: this.dto.capacity,
      price_pen: this.dto.pricePen,
      price_usd: this.dto.priceUsd,
      room_type: this.dto.roomType,
      season_type: this.dto.seasonType,
      service_tax: this.dto.serviceTax,
      rate_usd: this.dto.rateUsd,
      // updated_at: new Date(), // TODO: add updated_at
    };
  }
  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
