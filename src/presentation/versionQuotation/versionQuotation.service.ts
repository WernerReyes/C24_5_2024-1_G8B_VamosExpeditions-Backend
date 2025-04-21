import { prisma, QuotationModel, VersionQuotationModel } from "@/data/postgres";
import type {
  DuplicateMultipleVersionQuotationDto,
  DuplicateVersionQuotationDto,
  GetVersionQuotationsDto,
  VersionQuotationDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import {
  type VersionQuotation,
  VersionQuotationEntity,
  VersionQuotationStatus,
} from "@/domain/entities";
import { CustomError } from "@/domain/error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse, PaginatedResponse } from "../response";
import type { VersionQuotationMapper } from "./versionQuotation.mapper";
import { PdfService } from "@/lib";
import { VersionQuotationReport } from "./versionQuotation.report";

export class VersionQuotationService {
  constructor(
    private readonly versionQuotationMapper: VersionQuotationMapper,
    private readonly versionQuotationReport: VersionQuotationReport,
    private readonly pdfService: PdfService
  ) {}

  public async updateVersionQuotation(
    versionQuotationDto: VersionQuotationDto
  ) {
    this.versionQuotationMapper.setDto = versionQuotationDto;

    const existVersionQuotation = await VersionQuotationModel.findUnique({
      where: this.versionQuotationMapper.findById.where,
      include: {
        trip_details: true,
      },
    });

    if (!existVersionQuotation)
      throw CustomError.notFound("Versión de cotización no encontrada");
    const { trip_details, ...restFields } = existVersionQuotation;

    if (
      existVersionQuotation.status !== VersionQuotationStatus.APPROVED &&
      existVersionQuotation.status !== VersionQuotationStatus.CANCELATED &&
      (versionQuotationDto.status === VersionQuotationStatus.APPROVED ||
        versionQuotationDto.status === VersionQuotationStatus.CANCELATED)
    ) {
      await this.approveVersionQuotation(existVersionQuotation);
    }

    if (
      existVersionQuotation.status === VersionQuotationStatus.APPROVED &&
      existVersionQuotation.official
    ) {
      throw CustomError.badRequest(
        "La cotización ya está aprobada y es oficial, no se puede modificar"
      );
    }

    this.versionQuotationMapper.setVersionQuotation = restFields;

    const updatedVersionQuotation = await VersionQuotationModel.update({
      where: this.versionQuotationMapper.findById.where,
      data: this.versionQuotationMapper.toUpdate,
      include: this.versionQuotationMapper.toInclude,
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2002") {
        throw CustomError.badRequest(
          "Los detalles de viaje ya no esta disponible, para esta cotización"
        );
      }
      if (error.code === "P2003") {
        throw CustomError.notFound("Detalles de viaje no encontrado");
      }
      throw error;
    });

    return new ApiResponse<VersionQuotationEntity>(
      200,
      "Versión de cotización actualizada correctamente",
      await await VersionQuotationEntity.fromObject(updatedVersionQuotation)
    );
  }

  private async approveVersionQuotation(versionQuotation: VersionQuotation) {
    if (versionQuotation.status === VersionQuotationStatus.APPROVED)
      throw CustomError.badRequest(
        "La cotización ya está aprobada, no se puede aprobar nuevamente"
      );

    if (
      !versionQuotation.trip_details?.id ||
      versionQuotation.status !== VersionQuotationStatus.COMPLETED ||
      versionQuotation.completion_percentage !== 100 ||
      !versionQuotation.final_price ||
      !versionQuotation.indirect_cost_margin ||
      !versionQuotation.profit_margin
    ) {
      throw CustomError.badRequest(
        "La cotización no ha sido completada al 100%"
      );
    }
  }

  public async duplicateMultipleVersionQuotation({
    ids,
    userId,
  }: DuplicateMultipleVersionQuotationDto) {
    let newVersionQuotations: VersionQuotationEntity[] = [];
    let count = 0;

    await prisma.$transaction(async () => {
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
    });

    if (count === ids.length)
      throw CustomError.badRequest(
        `No se pudieron duplicar ninguna de las versiones de cotización`
      );

    return new ApiResponse<VersionQuotationEntity[]>(
      201,
      `Se duplicaron ${newVersionQuotations.length} versiones de cotización correctamente`,
      newVersionQuotations.map((versionQuotation) => {
        return {
          ...versionQuotation,
          quotation: undefined,
        };
      })
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
    if (versionQuotation.status === VersionQuotationStatus.APPROVED)
      throw CustomError.badRequest(
        "La cotización ya tiene una reserva aprobada, no se puede cambiar la versión oficial"
      );

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
      unOfficial: await VersionQuotationEntity.fromObject(unOfficial),
      newOfficial: await VersionQuotationEntity.fromObject(newOfficial),
    });
  }

  public async cancelAndReplaceApprovedOfficialVersionQuotation(
    id: VersionQuotationIDDto
  ) {
    const existVersionQuotation = await QuotationModel.findUnique({
      where: { id_quotation: id.versionQuotationId!.quotationId },
      include: {
        version_quotation: {
          select: {
            version_number: true,
            official: true,
            status: true,
          },
        },
      },
    });
    if (!existVersionQuotation)
      throw CustomError.notFound("Versión de cotización no encontrada");

    const approveVersion = existVersionQuotation.version_quotation.find(
      (version) =>
        version.official && version.status === VersionQuotationStatus.APPROVED
    );
    if (!approveVersion)
      throw CustomError.badRequest(
        "No existe una versión oficial de la cotización"
      );

    if (approveVersion.version_number === id.versionQuotationId!.versionNumber)
      throw CustomError.badRequest("La versión de cotización ya es la oficial");

    const existNewApproved = await existVersionQuotation.version_quotation.find(
      (version) =>
        version.version_number === id.versionQuotationId!.versionNumber
    );
    if (!existNewApproved)
      throw CustomError.notFound("Versión de cotización no encontrada");

    const [newApproved, oldApproved] = await prisma.$transaction(async () => {
      const oldApproved = await VersionQuotationModel.update({
        where: {
          version_number_quotation_id: {
            version_number: approveVersion.version_number,
            quotation_id: id.versionQuotationId!.quotationId,
          },
        },
        data: {
          status: VersionQuotationStatus.CANCELATED,
          official: false,
        },
        include: this.versionQuotationMapper.toSelectInclude,
      });
      const newApproved = await VersionQuotationModel.update({
        where: {
          version_number_quotation_id: {
            version_number: id.versionQuotationId!.versionNumber,
            quotation_id: id.versionQuotationId!.quotationId,
          },
        },
        data: {
          status: VersionQuotationStatus.APPROVED,
          official: true,
        },
        include: this.versionQuotationMapper.toSelectInclude,
      });

      return [newApproved, oldApproved];
    });

    return new ApiResponse<{
      newApproved: VersionQuotationEntity;
      oldApproved: VersionQuotationEntity;
    }>(200, "Versión de cotización actualizada correctamente", {
      newApproved: await VersionQuotationEntity.fromObject(newApproved),
      oldApproved: await VersionQuotationEntity.fromObject(oldApproved),
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
      include: this.versionQuotationMapper.toInclude,
    });

    if (!versionsQuotation)
      throw CustomError.notFound("Versión de cotización no encontrada");

    return new ApiResponse<VersionQuotationEntity>(
      200,
      "Versión de cotización encontrada",
      await VersionQuotationEntity.fromObject(versionsQuotation)
    );
  }

  public async getVersionsQuotation(
    getVersionQuotationsDto: GetVersionQuotationsDto
  ) {
    this.versionQuotationMapper.setDto = getVersionQuotationsDto;
    const versionsQuotation = await VersionQuotationModel.findMany({
      take: getVersionQuotationsDto.limit,
      skip: (getVersionQuotationsDto.page - 1) * getVersionQuotationsDto.limit,
      orderBy: {
        created_at: "desc",
      },
      where: this.versionQuotationMapper.getVersionsQuotationsWhere,
      include: {
        ...this.versionQuotationMapper.toSelectInclude,
        quotation: {
          include: {
            version_quotation: {
              select: {
                official: true,
              },
            },
            reservation: true,
          },
        },
      },
    }).catch((error) => {
      throw CustomError.internalServer(`${error}`);
    });

    //* Count based on the same condition
    const totalCount = await VersionQuotationModel.count({
      where: this.versionQuotationMapper.getVersionsQuotationsWhere,
    });

    return new ApiResponse<
      PaginatedResponse<
        VersionQuotationEntity & {
          hasUnofficialVersions: boolean;
        }
      >
    >(
      200,
      "Versión de cotización encontrada",
      new PaginatedResponse(
        await Promise.all(
          versionsQuotation.map(async ({ quotation, ...rest }) => {
            const versionQuotationEntity =
              await VersionQuotationEntity.fromObject({
                ...rest,
                quotation: {
                  ...quotation,
                  version_quotation: undefined,
                  reservation: rest.official
                    ? quotation.reservation
                    : undefined,
                },
              });

            return {
              ...versionQuotationEntity,
              hasUnofficialVersions:
                quotation.version_quotation.filter(
                  (version) => !version.official
                ).length > 0,
            };
          })
        ),
        getVersionQuotationsDto.page,
        Math.ceil(totalCount / getVersionQuotationsDto.limit),
        totalCount,
        getVersionQuotationsDto.limit
      )
    );
  }

  public async getTotalDraftsVersionQuotation() {
    const now = new Date();

    //* First day of the current month
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    //* First and last day of the previous month
    const firstDayPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    //* Count drafts for the current month
    const currentMonthDrafts = await VersionQuotationModel.count({
      where: {
        status: "DRAFT",
        created_at: {
          gte: firstDayCurrentMonth,
        },
      },
    });

    //* Count drafts for the previous month
    const previousMonthDrafts = await VersionQuotationModel.count({
      where: {
        status: "DRAFT",
        created_at: {
          gte: firstDayPreviousMonth,
          lte: lastDayPreviousMonth,
        },
      },
    });

    //* Calculate the increase
    const increase = currentMonthDrafts - previousMonthDrafts;

    return new ApiResponse<{
      totalDrafts: number;
      totalDraftsPreviousMonth: number;
      increase: number;
    }>(200, "Total de borradores de cotización", {
      totalDrafts: currentMonthDrafts,
      totalDraftsPreviousMonth: previousMonthDrafts,
      increase,
    });
  }

  public async deleteMultipleVersionQuotation(ids: VersionQuotationIDDto[]) {
    let versionQuotationsDeleted: VersionQuotationEntity[] = [];
    let versionQuotationsUpdated: VersionQuotationEntity[] = [];

    const versionQuotations = await VersionQuotationModel.findMany({
      where: {
        OR: ids.map((id) => ({
          AND: [
            { version_number: id.versionQuotationId?.versionNumber },
            { quotation_id: id.versionQuotationId?.quotationId },
          ],
        })),
      },
      include: {
        quotation: {
          include: {
            reservation: true,
          },
        },
      },
    });

    const versionWithoutReservation = versionQuotations.filter(
      (version) =>
        !version.quotation?.reservation ||
        (version.quotation?.reservation && !version.official)
    );

    const deletePromises = versionWithoutReservation.map(
      async ({ version_number, quotation_id }) => {
        if (!version_number || !quotation_id)
          return {
            success: false,
            error: "ID inválido",
          };

        try {
          const deletedQuotation = await VersionQuotationModel.delete({
            where: {
              version_number_quotation_id: {
                version_number,
                quotation_id,
              },
            },
            include: this.versionQuotationMapper.toSelectInclude,
          }).catch((error) => {
            throw error;
          });

          if (!deletedQuotation) {
            return {
              success: false,
              error: "No se pudo eliminar la cotización",
            };
          }

          versionQuotationsDeleted.push(
            await VersionQuotationEntity.fromObject(deletedQuotation)
          );

          return { success: true };
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            return { success: false, error: "Error en la base de datos" };
          }
          throw error; //* Throw the error to the catch block
        }
      }
    );

    //* Wait for all promises to resolve
    const results = await Promise.allSettled(deletePromises);

    const failedDeletions = results.filter(
      (result) => result.status === "fulfilled" && !result.value.success
    ).length;
    const successfulDeletions = ids.length - failedDeletions;

    if (successfulDeletions === 0) {
      throw CustomError.badRequest(
        "No se pudieron eliminar ninguna de las versiones de cotización"
      );
    }

    await prisma.$transaction(async () => {
      const uniqueQuotations = versionQuotationsDeleted.filter(
        (version, index, self) =>
          index ===
          self.findIndex((t) => t?.id.quotationId === version.id.quotationId)
      );

      for (const version of uniqueQuotations) {
        //* Find the minimum version number
        const currentVersions = await VersionQuotationModel.findMany({
          where: {
            quotation_id: version.id.quotationId,
          },
          select: {
            quotation_id: true,
            official: true,
            version_number: true,
          },
          orderBy: {
            version_number: "asc",
          },
        });

        const minVersion = currentVersions[0];

        if (!minVersion || minVersion.official) continue;

        const versionUpdated = await VersionQuotationModel.update({
          where: {
            version_number_quotation_id: {
              version_number: minVersion.version_number,
              quotation_id: minVersion.quotation_id,
            },
          },
          data: {
            official: true,
          },
          include: this.versionQuotationMapper.toSelectInclude,
        });

        versionQuotationsUpdated.push(
          await VersionQuotationEntity.fromObject(versionUpdated)
        );
      }
    });

    return new ApiResponse<{
      versionQuotationsDeleted: VersionQuotationEntity[];
      versionQuotationsUpdated: VersionQuotationEntity[];
    }>(
      200,
      `Se eliminaron ${successfulDeletions} versiones de cotización correctamente`,
      {
        versionQuotationsDeleted: versionQuotationsDeleted.map((version) => {
          return {
            ...version,
            quotation: undefined,
          };
        }),
        versionQuotationsUpdated,
      }
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
            hotel_room_trip_details: true,
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
      await VersionQuotationEntity.fromObject(newVersionQuotation)
    );
  }

  public async generatePdf({ versionQuotationId }: VersionQuotationIDDto) {
    const versionQuotation = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number: versionQuotationId!.versionNumber,
          quotation_id: versionQuotationId!.quotationId,
        },
        status: {
          not: VersionQuotationStatus.DRAFT,
        },
      },
      include: {
        trip_details: {
          include: {
            hotel_room_trip_details: {
              orderBy: {
                date: "asc",
              },
              include: {
                hotel_room: {
                  include: {
                    hotel: true,
                  },
                },
              },
            },
            client: true,
          },
        },
        user: true,
      },
    });
    if (!versionQuotation)
      throw CustomError.badRequest(
        "Versión de cotización no encontrada o no completado"
      );

    const pdfGenerated = await this.versionQuotationReport.generateReport({
      title: "",
      subTitle: "",
      dataQuey: versionQuotation,
    });

    return await this.pdfService.createPdf(pdfGenerated);
  }
}
