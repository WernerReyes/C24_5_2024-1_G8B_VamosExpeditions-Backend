import type { ClientDto } from "@/domain/dtos";
import { type Prisma } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

type Dto = ClientDto;
export class ClientMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get toUpsert(): Prisma.clientUncheckedCreateInput {
    this.dto = this.dto as ClientDto;
    return {
      fullName: this.dto.fullName,
      country: this.dto.country,
      email: this.dto.email ? this.dto.email : null,
      phone: this.dto.phone ? this.dto.phone : null,
      subregion: this.dto.subregion,
    };
  }

  get toSelectInclude(): Prisma.clientInclude<DefaultArgs> {
    return {};
  }
}
