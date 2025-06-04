import { type Prisma } from "@prisma/client";

import type { ClientDto, GetClientsDto } from "@/domain/dtos";

import { ParamsUtils } from "@/core/utils";

import { type DefaultArgs } from "@prisma/client/runtime/library";

type Dto = ClientDto | GetClientsDto;

export class ClientMapper {
  private dto: Dto;

  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  // Crear o actualizar cliente
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

  // Campos select personalizados
  public get toSelect(): Prisma.clientSelect | undefined {
    const { select } = this.dto as GetClientsDto;
    if (!select) return this.defaultSelect;
    return ParamsUtils.parseDBSelect(select);
  }

  private get defaultSelect(): Prisma.clientSelect {
    return {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      subregion: true,
      country: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  // Relaciones a incluir (placeholder)
  public get toSelectInclude(): Prisma.clientInclude<DefaultArgs> {
    return {};
  }

  // Filtros para listados
  public get filters(): Prisma.clientWhereInput {
    this.dto = this.dto as GetClientsDto;

    return {
      fullName: this.dto.fullName
        ? { contains: this.dto.fullName, mode: "insensitive" }
        : undefined,
      email: this.dto.email
        ? { contains: this.dto.email, mode: "insensitive" }
        : undefined,
      phone: this.dto.phone
        ? { contains: this.dto.phone, mode: "insensitive" }
        : undefined,
      subregion: this.dto.subregion
        ? { contains: this.dto.subregion, mode: "insensitive" }
        : undefined,
      createdAt: this.dto.createdAt
        ? { gte: new Date(this.dto.createdAt) }
        : undefined,
      updatedAt: this.dto.updatedAt
        ? { gte: new Date(this.dto.updatedAt) }
        : undefined,
      is_deleted: this.dto.isDeleted,
    };
  }
}
