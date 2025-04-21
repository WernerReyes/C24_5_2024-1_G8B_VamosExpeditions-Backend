import { prisma, QuotationModel, VersionQuotationModel } from "@/data/postgres";
import type {
  ArchiveVersionQuotationDto,
  DuplicateMultipleVersionQuotationDto,
  GetVersionQuotationsDto,
  SendEmailAndGenerateReportDto,
  VersionQuotationDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import {
  AllowVersionQuotationType,
  UserEntity,
  type VersionQuotation,
  VersionQuotationEntity,
  VersionQuotationStatus,
} from "@/domain/entities";
import { CustomError } from "@/domain/error";
import type { EmailService, PdfService } from "@/lib";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { ApiResponse, PaginatedResponse } from "../response";
import type { VersionQuotationMapper } from "./versionQuotation.mapper";
import type { VersionQuotationReport } from "./versionQuotation.report";

export class VersionQuotationService {
  constructor(
    private readonly versionQuotationMapper: VersionQuotationMapper,
    private readonly versionQuotationReport: VersionQuotationReport,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService
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
    const versionQuotations = await VersionQuotationModel.findMany({
      where: {
        OR: ids.map((id) => ({
          AND: [
            { version_number: id.versionNumber },
            { quotation_id: id.quotationId },
          ],
        })),
      },
      include: {
        trip_details: {
          include: {
            trip_details_has_city: true,
            hotel_room_trip_details: true,
          },
        },
      },
    });

    if (versionQuotations.length === 0)
      throw CustomError.notFound("Versión de cotización no encontrada");

    const {
      versionToInsert,
      tripDetailsToInsert,
      tripDetailsHasCityToInsert,
      hotelRoomTripToInsert,
    } = await this.getDuplicateVersionQuotation(versionQuotations, userId);

    const newVersionsDuplicated = await prisma
      .$transaction(async (tx) => {
        let newVersionsDuplicated =
          await tx.version_quotation.createManyAndReturn({
            data: versionToInsert,
            include: {
              user: true,
            },
          });

        let insertedTripDetails = await tx.trip_details.createManyAndReturn({
          data: tripDetailsToInsert,
          include: {
            client: true,
          },
        });

        const tripDetailsHasCityFinal = tripDetailsHasCityToInsert.map((c) => ({
          city_id: c.city_id,
          trip_details_id: insertedTripDetails[c.trip_index].id,
        }));

        const hotelRoomTripFinal = hotelRoomTripToInsert.map((h) => ({
          hotel_room_id: h.hotel_room_id,
          date: h.date,
          cost_person: h.cost_person,
          trip_details_id: insertedTripDetails[h.trip_index].id,
        }));

        if (tripDetailsHasCityFinal.length > 0) {
          await tx.trip_details_has_city.createMany({
            data: tripDetailsHasCityFinal,
          });
        }

        if (hotelRoomTripFinal.length > 0) {
          await tx.hotel_room_trip_details.createMany({
            data: hotelRoomTripFinal,
          });
        }

        insertedTripDetails = insertedTripDetails.map((trip) => {
          return {
            ...trip,
            trip_details_has_city: tripDetailsHasCityFinal.filter(
              (c) => c.trip_details_id === trip.id
            ),
            hotel_room_trip_details: hotelRoomTripFinal.filter(
              (h) => h.trip_details_id === trip.id
            ),
          };
        });

        newVersionsDuplicated = newVersionsDuplicated.map((version) => {
          const trip_details = insertedTripDetails.find(
            (trip) =>
              trip.quotation_id === version.quotation_id &&
              trip.version_number === version.version_number
          );
          return {
            ...version,
            trip_details,
          };
        });

        return newVersionsDuplicated;
      })
      .catch((error) => {
        throw CustomError.internalServer(
          `Error al duplicar las versiones de cotización: ${error}`
        );
      });

    return new ApiResponse<VersionQuotationEntity[]>(
      201,
      `Se duplicaron ${newVersionsDuplicated.length} versiones de cotización correctamente`,
      await Promise.all(
        newVersionsDuplicated.map((versionQuotation) =>
          VersionQuotationEntity.fromObject(versionQuotation)
        )
      )
    );
  }

  private async getDuplicateVersionQuotation(
    versions: VersionQuotation[],
    userId: UserEntity["id"]
  ) {
    const versionToInsert: VersionQuotation[] = [];
    const tripDetailsToInsert: any[] = [];
    const tripDetailsHasCityToInsert: any[] = [];
    const hotelRoomTripToInsert: any[] = [];

    const versionMap: Record<number, number> = {}; // Track last version per quotation

    for (const v of versions) {
      let lastVersion = versionMap[v.quotation_id];

      if (lastVersion === undefined) {
        const last = await prisma.version_quotation.aggregate({
          where: { quotation_id: v.quotation_id },
          _max: { version_number: true },
        });

        lastVersion = last._max.version_number ?? 0;
      }

      // Increment for this new version
      const newVersionNumber = lastVersion + 1;
      versionMap[v.quotation_id] = newVersionNumber;

      // Preparar nueva versión
      versionToInsert.push({
        version_number: newVersionNumber,
        quotation_id: v.quotation_id,
        indirect_cost_margin: v.indirect_cost_margin,
        name: v.name + "_copy",
        profit_margin: v.profit_margin,
        final_price: v.final_price,
        official: false,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
        status: v.status,
        completion_percentage: v.completion_percentage,
        commission: v.commission,
        partner_id: v.partner_id,
        archived_at: null,
        archive_reason: null,
        is_archived: false,
      });

      if (v.trip_details) {
        const newTripDetail = {
          version_number: newVersionNumber,
          quotation_id: v.quotation_id,
          start_date: v.trip_details.start_date,
          end_date: v.trip_details.end_date,
          number_of_people: v.trip_details.number_of_people,
          traveler_style: v.trip_details.traveler_style,
          code: v.trip_details.code,
          order_type: v.trip_details.order_type,
          additional_specifications: v.trip_details.additional_specifications,
          client_id: v.trip_details.client_id,
        };

        tripDetailsToInsert.push(newTripDetail);
        const tripIndex = tripDetailsToInsert.length - 1;

        for (const c of v?.trip_details?.trip_details_has_city ?? []) {
          tripDetailsHasCityToInsert.push({
            city_id: c.city_id,
            trip_index: tripIndex,
          });
        }

        for (const h of v?.trip_details?.hotel_room_trip_details ?? []) {
          hotelRoomTripToInsert.push({
            hotel_room_id: h.hotel_room_id,
            date: h.date,
            cost_person: h.cost_person,
            trip_index: tripIndex,
          });
        }
      }
    }

    return {
      versionToInsert,
      tripDetailsToInsert,
      tripDetailsHasCityToInsert,
      hotelRoomTripToInsert,
    };
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

  public async archiveVersionQuotation({
    archiveReason,
    id,
    official,
  }: ArchiveVersionQuotationDto) {
    const archivedVersionQuotation = await VersionQuotationModel.update({
      where: {
        version_number_quotation_id: {
          version_number: id.versionNumber,
          quotation_id: id.quotationId,
        },
        is_archived: false,
      },
      data: {
        is_archived: true,
        archived_at: new Date(),
        archive_reason: archiveReason,
        official,
      },
      include: this.versionQuotationMapper.toSelectInclude,
    }).catch((error) => {
      if (error.code === "P2025") {
        throw CustomError.notFound("Versión de cotización no encontrada");
      }

      throw error;
    });

    return new ApiResponse<VersionQuotationEntity>(
      200,
      `Versión de cotización "${archivedVersionQuotation.name}" archivada correctamente`,
      await VersionQuotationEntity.fromObject(archivedVersionQuotation)
    );
  }

  public async unArchiveVersionQuotation({
    versionQuotationId,
  }: VersionQuotationIDDto) {
    const unArchivedVersionQuotation = await VersionQuotationModel.update({
      where: {
        version_number_quotation_id: {
          version_number: versionQuotationId!.versionNumber,
          quotation_id: versionQuotationId!.quotationId,
        },
        is_archived: true,
      },
      data: {
        is_archived: false,
        archived_at: null,
        archive_reason: null,
      },
      include: this.versionQuotationMapper.toSelectInclude,
    }).catch((error) => {
      if (error.code === "P2025") {
        throw CustomError.notFound("Versión de cotización no encontrada");
      }

      throw error;
    });

    return new ApiResponse<VersionQuotationEntity>(
      200,
      `Versión de cotización "${unArchivedVersionQuotation.name}" desarchivada correctamente`,
      await VersionQuotationEntity.fromObject(unArchivedVersionQuotation)
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
        is_archived: false,
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
                is_archived: true,
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

    return new ApiResponse<PaginatedResponse<VersionQuotationEntity>>(
      200,
      "Versión de cotización encontrada",
      new PaginatedResponse(
        await Promise.all(
          versionsQuotation.map((versionQuotation) =>
            VersionQuotationEntity.fromObject(versionQuotation as any)
          )
        ),
        getVersionQuotationsDto.page,
        Math.ceil(totalCount / getVersionQuotationsDto.limit),
        totalCount,
        getVersionQuotationsDto.limit
      )
    );
  }

  public async generatePdf({ versionQuotationId }: VersionQuotationIDDto) {
    const versionQuotation = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number: versionQuotationId!.versionNumber,
          quotation_id: versionQuotationId!.quotationId,
        },
        is_archived: false,
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

  public async sendEmailAndGenerateReport({
    resources,
    versionQuotationId,
    ...data
  }: SendEmailAndGenerateReportDto) {
    const [document, versionQuotation] = await new Promise(
      async (
        resolve: ([document, versionQuotation]: [
          TDocumentDefinitions,
          VersionQuotation
        ]) => void,
        reject: (error: string) => void
      ) => {
        switch (resources) {
          case AllowVersionQuotationType.TRANSPORTATION:
            break;

          case AllowVersionQuotationType.ACCOMMODATION:
            const versionQuotation = await VersionQuotationModel.findUnique({
              where: {
                version_number_quotation_id: {
                  version_number: versionQuotationId.versionNumber,
                  quotation_id: versionQuotationId.quotationId,
                },
                is_archived: false,
              },
              omit: {
                created_at: true,
                updated_at: true,
              },
              include: {
                user: {
                  omit: {
                    id_role: true,
                    password: true,
                  },
                },
                trip_details: {
                  omit: {
                    client_id: true,
                  },
                  include: {
                    client: {
                      omit: {
                        createdAt: true,
                        updatedAt: true,
                      },
                    },
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
                  },
                },
              },
            });

            if (!versionQuotation)
              reject("No se encontró la versión de cotización");

            const document = await this.versionQuotationReport.generateReport({
              title: "",
              subTitle: "",
              dataQuey: versionQuotation as VersionQuotation,
            });

            resolve([document, versionQuotation as VersionQuotation]);
            break;
        }
      }
    ).catch((error) => {
      throw CustomError.badRequest(`${error}`);
    });

    const pdfBuffer = await this.pdfService.createPdfEmail(document);

    await this.emailService.sendEmailForVersionQuotation(
      {
        serviceType: resources,
        versionQuotation,
        description: data.description,
      },
      {
        to: data.to,
        subject: data.subject,
        attachments: [
          {
            filename: `Cotización-${versionQuotation.name}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      }
    );

    return new ApiResponse<void>(
      200,
      `Se envió el correo correctamente a los siguientes usuarios: ${data.to.join(
        ", "
      )}`,
      undefined
    );
  }
}
