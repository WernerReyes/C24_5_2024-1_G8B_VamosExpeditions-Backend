import type {
  DuplicateVersionQuotationDto,
  VersionQuotationDto,
} from "@/domain/dtos";
import type { VersionQuotationMapper } from "./versionQuotation.mapper";
import type { VersionQuotationResponse } from "./versionQuotation.response";
import { VersionQuotationModel } from "@/data/postgres";
import { CustomError } from "@/domain/error";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class VersionQuotationService {
  constructor(
    private readonly versionQuotationMapper: VersionQuotationMapper,
    private readonly versionQuotationResponse: VersionQuotationResponse
  ) {}

  public async updateVersionQuotation(
    versionQuotationDto: VersionQuotationDto
  ) {
    this.versionQuotationMapper.setDto = versionQuotationDto;
    try {
      const existVersionQuotation = await VersionQuotationModel.findUnique(
        this.versionQuotationMapper.findById
      );

      if (!existVersionQuotation)
        throw CustomError.notFound("Versión de cotización no encontrada");

      // if (versionQuotationDto.official) {
      //   const officialVersion = await VersionQuotationModel.findFirst({
      //     where: {
      //       quotation_id: versionQuotationDto.quotationId,
      //       official: true,
      //     },
      //   });

      //   VersionQuotationModel.update({
      //     where: {
      //       version_number_quotation_id: {
      //         version_number: officialVersion!.version_number,
      //         quotation_id: officialVersion!.quotation_id,
      //       },
      //       official: true,
      //     },
      //     data: {
      //       official: false,
      //     },
      //   });
      // }

      const updatedVersionQuotation = await VersionQuotationModel.update({
        where: this.versionQuotationMapper.findById.where,
        data: this.versionQuotationMapper.toUpdate,
        include: this.versionQuotationMapper.toSelectInclude,
      }).catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2002") {
          throw CustomError.badRequest(
            "La reserva ya no esta disponible, para esta cotización"
          );
        }
        throw error;
      });

      return this.versionQuotationResponse.updatedVersionQuotation(
        updatedVersionQuotation
      );
    } catch (error) {
      if (error instanceof CustomError) throw error;

      throw CustomError.internalServer(`${error}`);
    }
  }

  public async duplicateVersionQuotation(
    duplicateVersionQuotationDto: DuplicateVersionQuotationDto
  ) {
    this.versionQuotationMapper.setDto = duplicateVersionQuotationDto;

    const versionQuotation = await VersionQuotationModel.findUnique({
      where: this.versionQuotationMapper.findById.where,
      include: {
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

    return this.versionQuotationResponse.duplicatedVersionQuotation(
      newVersionQuotation
    );
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

    return this.versionQuotationResponse.versionQuotationFound(
      versionsQuotation
    );
  }

  public async getVersionsQuotation() {
    const versionsQuotation = await VersionQuotationModel.findMany({
      include: {
        ...this.versionQuotationMapper.toSelectInclude,
        reservation: {
          include: {
            client: true,
          }
        },
      },
    });

    return this.versionQuotationResponse.versionsQuotationFound(
      versionsQuotation
    );
  }
}
