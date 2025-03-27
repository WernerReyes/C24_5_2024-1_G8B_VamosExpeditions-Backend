import { prisma, VersionQuotationModel } from "@/data/postgres";
import type {
  DuplicateMultipleVersionQuotationDto,
  DuplicateVersionQuotationDto,
  VersionQuotationDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import { VersionQuotationEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "../response";
import type { VersionQuotationMapper } from "./versionQuotation.mapper";

export class VersionQuotationService {
  constructor(
    private readonly versionQuotationMapper: VersionQuotationMapper
  ) {}

  public async updateVersionQuotation(
    versionQuotationDto: VersionQuotationDto
  ) {
    this.versionQuotationMapper.setDto = versionQuotationDto;

    const existVersionQuotation = await VersionQuotationModel.findUnique(
      this.versionQuotationMapper.findById
    );

    if (!existVersionQuotation)
      throw CustomError.notFound("Versión de cotización no encontrada");
    this.versionQuotationMapper.setVersionQuotation = existVersionQuotation;

    const updatedVersionQuotation = await VersionQuotationModel.update({
      where: this.versionQuotationMapper.findById.where,
      data: this.versionQuotationMapper.toUpdate,
      include: this.versionQuotationMapper.toSelectInclude,
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2002") {
        throw CustomError.badRequest(
          "Los detalles de viaje ya no esta disponible, para esta cotización"
        );
      }
      throw error;
    });

    return new ApiResponse<VersionQuotationEntity>(
      200,
      "Versión de cotización actualizada correctamente",
      VersionQuotationEntity.fromObject(updatedVersionQuotation)
    );
  }

  public async duplicateMultipleVersionQuotation({
    ids,
    userId,
  }: DuplicateMultipleVersionQuotationDto) {
    let newVersionQuotations: VersionQuotationEntity[] = [];
    let count = 0;

    for (const id of ids) {
      await this.duplicateVersionQuotation({
        id,
        userId,
      })
        .then((versionQuotation) =>
          newVersionQuotations.push(versionQuotation.data)
        )
        .catch((error) => {
          if (error instanceof CustomError) count++;
          else throw error;
        });
    }

    if (count === ids.length)
      throw CustomError.badRequest(
        `No se pudieron duplicar ninguna de las versiones de cotización`
      );

    return new ApiResponse<VersionQuotationEntity[]>(
      201,
      `Se duplicaron ${newVersionQuotations.length} versiones de cotización correctamente`,
      newVersionQuotations
    );
  }

  public async updateOfficialVersionQuotation({
    versionQuotationId,
  }: VersionQuotationIDDto) {
    const versionQuotation = await VersionQuotationModel.findFirst({
      where: {
        quotation_id: versionQuotationId?.quotationId,
        official: true,
      },
    });
    if (!versionQuotation)
      throw CustomError.notFound("Versión de cotización no encontrada");

    const [unOfficial, newOfficial] = await prisma.$transaction([
      VersionQuotationModel.update({
        where: {
          version_number_quotation_id: {
            version_number: versionQuotation.version_number,
            quotation_id: versionQuotation.quotation_id,
          },
        },
        data: {
          official: false,
        },
        include: this.versionQuotationMapper.toSelectInclude,
      }),
      VersionQuotationModel.update({
        where: {
          version_number_quotation_id: {
            version_number: versionQuotationId!.versionNumber,
            quotation_id: versionQuotationId!.quotationId,
          },
        },
        data: {
          official: true,
        },
        include: this.versionQuotationMapper.toSelectInclude,
      }),
    ]);

    return new ApiResponse<{
      unOfficial: VersionQuotationEntity;
      newOfficial: VersionQuotationEntity;
    }>(200, "Versión de cotización actualizada correctamente", {
      unOfficial: VersionQuotationEntity.fromObject(unOfficial),
      newOfficial: VersionQuotationEntity.fromObject(newOfficial),
    });
  }

  public async getVersionQuotationById(id: {
    quotationId: number;
    versionNumber: number;
  }) {
    const versionsQuotation = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number: id.versionNumber,
          quotation_id: id.quotationId,
        },
      },
      include: this.versionQuotationMapper.toSelectInclude,
    });
    if (!versionsQuotation)
      throw CustomError.notFound("Versión de cotización no encontrada");

    return new ApiResponse<VersionQuotationEntity>(
      200,
      "Versión de cotización encontrada",
      VersionQuotationEntity.fromObject(versionsQuotation)
    );
  }

  //
  public async getVersionsQuotation() {
    const versionsQuotation = await VersionQuotationModel.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        ...this.versionQuotationMapper.toSelectInclude,
        trip_details: {
          include: {
            client: true,
          },
        },
      },
    });
   //console.log(versionsQuotation)
    return new ApiResponse<VersionQuotationEntity[]>(
      200,
      "Versión de cotización encontrada",
      versionsQuotation.map(VersionQuotationEntity.fromObject)
    );
  }

  private async duplicateVersionQuotation(
    duplicateVersionQuotationDto: DuplicateVersionQuotationDto
  ) {
    this.versionQuotationMapper.setDto = duplicateVersionQuotationDto;

    const versionQuotation = await VersionQuotationModel.findUnique({
      where: this.versionQuotationMapper.findById.where,
      include: {
        trip_details: {
          include: {
            trip_details_has_city: true,
          },
        },
        quotation: {
          include: {
            version_quotation: true,
          },
        },
      },
    });

    if (!versionQuotation)
      throw CustomError.notFound("Versión de cotización no encontrada");

    this.versionQuotationMapper.setVersionQuotation = versionQuotation;

    const newVersionQuotation = await VersionQuotationModel.create({
      data: this.versionQuotationMapper.toDuplicate,
      include: this.versionQuotationMapper.toSelectInclude,
    });

    return new ApiResponse<VersionQuotationEntity>(
      201,
      "Versión de cotización duplicada correctamente",
      VersionQuotationEntity.fromObject(newVersionQuotation)
    );
  }
}
