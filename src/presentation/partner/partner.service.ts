import { PartnerModel } from "@/infrastructure/models";
import { PartnerMapper } from "./partner.mapper";
import { ApiResponse, PaginatedResponse } from "../response";
import { PartnerEntity } from "@/domain/entities";
import { GetPartnersDto, PartnerDto, TrashDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class PartnerService {
  constructor(private readonly partnerMapper: PartnerMapper) {}

  public async getPartnersAll(getPartnersDto: GetPartnersDto) {
    const { page, limit } = getPartnersDto;

    this.partnerMapper.setDto = getPartnersDto;

    const partners = await PartnerModel.findMany({
      select: this.partnerMapper.toSelect,
      where: this.partnerMapper.filters,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPartners = await PartnerModel.count({
      where: this.partnerMapper.filters,
    });

    return new ApiResponse<PaginatedResponse<PartnerEntity>>(
      200,
      "Partners encontrados",
      new PaginatedResponse(
        await Promise.all(
          partners.map((partner) => PartnerEntity.fromObject(partner))
        ),
        page,
        Math.ceil(totalPartners / limit),
        totalPartners,
        limit
      )
    );
  }
  public async upsertPartner(partnerDto: PartnerDto) {
    this.partnerMapper.setDto = partnerDto;

    const existingPartner = await PartnerModel.findUnique({
      where: { id: partnerDto.id },
    });

    const partnerData = existingPartner
      ? await PartnerModel.update({
          where: { id: partnerDto.id },
          data: this.partnerMapper.updatePartner,
        })
      : await PartnerModel.create({
          data: this.partnerMapper.createPartner,
        });

    return new ApiResponse(
      200,
      existingPartner ? "Partner actualizado" : "Partner creado",
      partnerData
    );
  }

  public async trashPartner({ id, deleteReason }: TrashDto) {
    const partner = await PartnerModel.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        is_deleted: true,
      },
    });

    if (!partner)
      throw CustomError.notFound(`No se encontró el partner con id ${id}`);

    const partnerDeleted = await PartnerModel.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: partner.is_deleted ? null : new Date(),
        is_deleted: !partner.is_deleted,
        delete_reason: partner.is_deleted ? null : deleteReason,
      },
    });

    return new ApiResponse<PartnerEntity>(
      200,
      partner.is_deleted
        ? "Partner restaurado correctamente"
        : "Partner eliminado correctamente",
      await PartnerEntity.fromObject(partnerDeleted)
    );
  }

  public async restorePartner(id: number) {
    return this.trashPartner({ id, deleteReason: undefined });
  }
}
