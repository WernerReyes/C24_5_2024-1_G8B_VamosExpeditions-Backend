import type {
  TrashDto,
  DuplicateMultipleVersionQuotationDto,
  GetVersionQuotationsDto,
  SendEmailAndGenerateReportDto,
  VersionQuotationDto,
  VersionQuotationIDDto,
} from "@/domain/dtos";
import { UserEntity, VersionQuotationEntity } from "@/domain/entities";
import { CustomError } from "@/domain/error";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse, PaginatedResponse } from "../response";
import type { VersionQuotationMailer } from "./versionQuotation.mailer";
import type { VersionQuotationMapper } from "./versionQuotation.mapper";

import {
  AllowVersionQuotationType,
  type IVersionQuotationModel,
  prisma,
  QuotationModel,
  VersionQuotationModel,
  VersionQuotationStatusEnum,
} from "@/infrastructure/models";

import { VersionQuotationExcel } from "./versionQuotation.excel";
import { VersionQuotationPdf } from "./versionQuotation.pdf";

export class VersionQuotationService {
  constructor(
    private readonly versionQuotationMapper: VersionQuotationMapper,
    private readonly versionQuotationMailer: VersionQuotationMailer,
    private readonly versionQuotationExcel: VersionQuotationExcel,
    private readonly versionQuotationPdf: VersionQuotationPdf
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
      existVersionQuotation.status !== VersionQuotationStatusEnum.APPROVED &&
      existVersionQuotation.status !== VersionQuotationStatusEnum.CANCELATED &&
      (versionQuotationDto.status === VersionQuotationStatusEnum.APPROVED ||
        versionQuotationDto.status === VersionQuotationStatusEnum.CANCELATED)
    ) {
      await this.approveVersionQuotation(existVersionQuotation);
    }

    if (
      existVersionQuotation.status === VersionQuotationStatusEnum.APPROVED &&
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

  private async approveVersionQuotation(
    versionQuotation: IVersionQuotationModel
  ) {
    if (versionQuotation.status === VersionQuotationStatusEnum.APPROVED)
      throw CustomError.badRequest(
        "La cotización ya está aprobada, no se puede aprobar nuevamente"
      );

    if (
      !versionQuotation.trip_details?.id ||
      versionQuotation.status !== VersionQuotationStatusEnum.COMPLETED ||
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
            service_trip_details: true,
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
      serviceTripToInsert,
    } = await this.getDuplicateVersionQuotation(versionQuotations, userId);

    const newVersionsDuplicated = await prisma
      .$transaction(async (tx) => {
        const newVersionsDuplicated =
          await tx.version_quotation.createManyAndReturn({
            data: versionToInsert,
            include: {
              user: true,
            },
          });

        const insertedTripDetails = await tx.trip_details.createManyAndReturn({
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

        const serviceTripFinal = serviceTripToInsert.map((s) => ({
          service_id: s.service_id,
          date: s.date,
          cost_person: s.cost_person,
          trip_details_id: insertedTripDetails[s.trip_index].id,
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

        if (serviceTripFinal.length > 0) {
          await tx.service_trip_details.createMany({
            data: serviceTripFinal,
          });
        }

        const updatedTripDetails = insertedTripDetails.map((trip) => ({
          ...trip,
          trip_details_has_city: tripDetailsHasCityFinal.filter(
            (c) => c.trip_details_id === trip.id
          ),
          hotel_room_trip_details: hotelRoomTripFinal.filter(
            (h) => h.trip_details_id === trip.id
          ),

          service_trip_details: serviceTripFinal.filter(
            (s) => s.trip_details_id === trip.id
          )
        }));

        return newVersionsDuplicated.map((version) => {
          const trip_details = updatedTripDetails.find(
            (trip) =>
              trip.quotation_id === version.quotation_id &&
              trip.version_number === version.version_number
          );
          return {
            ...version,
            trip_details,
          };
        });
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
    versions: IVersionQuotationModel[],
    userId: UserEntity["id"]
  ) {
    const versionToInsert: IVersionQuotationModel[] = [];
    const tripDetailsToInsert: any[] = [];
    const tripDetailsHasCityToInsert: any[] = [];
    const hotelRoomTripToInsert: any[] = [];
    const serviceTripToInsert: any[] = [];

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
        deleted_at: null,
        delete_reason: null,
        is_deleted: false,
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

        for (const s of v?.trip_details?.service_trip_details?? []) {
          serviceTripToInsert.push({
            service_id: s.service_id,
            date: s.date,
            cost_person: s.cost_person,
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
      serviceTripToInsert,
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
    if (versionQuotation.status === VersionQuotationStatusEnum.APPROVED)
      throw CustomError.badRequest(
        "La cotización ya tiene una reserva aprobada, no se puede cambiar la versión oficial"
      );

    const [unOfficial, newOfficial] = await prisma.$transaction(async (tx) => {
      const unOfficial = await tx.version_quotation.update({
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
      });

      const newOfficial = await tx.version_quotation.update({
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
      });

      return [unOfficial, newOfficial];
    });

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
        version.official &&
        version.status === VersionQuotationStatusEnum.APPROVED
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
          status: VersionQuotationStatusEnum.CANCELATED,
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
          status: VersionQuotationStatusEnum.APPROVED,
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

  public async trashVersionQuotation({
    deleteReason,
    id,
  }: TrashDto<{ versionNumber: number; quotationId: number }>) {
    const archivedVersionQuotation = await VersionQuotationModel.update({
      where: {
        version_number_quotation_id: {
          version_number: id.versionNumber,
          quotation_id: id.quotationId,
        },
        is_deleted: false,
      },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
        delete_reason: deleteReason,
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

  public async restoreVersionQuotation({
    versionQuotationId,
  }: VersionQuotationIDDto) {
    const quotation = await QuotationModel.findUnique({
      where: { id_quotation: versionQuotationId!.quotationId },
      include: {
        version_quotation: {
          select: {
            version_number: true,
            official: true,
            is_deleted: true,
          },
        },
      },
    });

    const existOfficialArchived = quotation?.version_quotation.find(
      (version) => version.official && version.is_deleted
    );

    if (existOfficialArchived) {
      await VersionQuotationModel.update({
        where: {
          version_number_quotation_id: {
            version_number: existOfficialArchived.version_number,
            quotation_id: versionQuotationId!.quotationId,
          },
          is_deleted: true,
          official: true,
        },
        data: {
          official: false,
        },
      });
    }

    const restoreVersionQuotation = await VersionQuotationModel.update({
      where: {
        version_number_quotation_id: {
          version_number: versionQuotationId!.versionNumber,
          quotation_id: versionQuotationId!.quotationId,
        },
        is_deleted: true,
      },
      data: {
        official: !!existOfficialArchived,
        is_deleted: false,
        deleted_at: null,
        delete_reason: null,
      },
      include: this.versionQuotationMapper.toSelectInclude,
    }).catch((error) => {
      if (error.code === "P2025") {
        throw CustomError.notFound("Versión de cotización no encontrada");
      }

      throw error;
    });

    return new ApiResponse<{
      newUnOfficial?: VersionQuotationEntity["id"];
      restoreVersionQuotation: VersionQuotationEntity;
    }>(
      200,
      `Versión de cotización "${restoreVersionQuotation.name}" desarchivada correctamente`,
      {
        newUnOfficial: existOfficialArchived
          ? {
              quotationId: versionQuotationId!.quotationId,
              versionNumber: existOfficialArchived.version_number,
            }
          : undefined,
        restoreVersionQuotation: await VersionQuotationEntity.fromObject(
          restoreVersionQuotation
        ),
      }
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
        is_deleted: false,
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
      select: this.versionQuotationMapper.toSelect,

      // include: {
      //   ...this.versionQuotationMapper.toSelectInclude,
      //   quotation: {
      //     include: {
      //       version_quotation: {
      //         select: {
      //           official: true,
      //           is_deleted: true,
      //         },
      //       },
      //       reservation: true,
      //     },
      //   },
      // },
    }).catch((error) => {
      throw CustomError.internalServer(error.message);
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
            VersionQuotationEntity.fromObject(versionQuotation)
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
        is_deleted: false,
        status: {
          not: VersionQuotationStatusEnum.DRAFT,
        },
      },
      include: {
        trip_details: {
          include: {
            service_trip_details: {
              include: {
                service: true,
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

    return await this.versionQuotationPdf.generate(versionQuotation);
  }

  public async sendEmailAndGenerateReport({
    // resources,
    versionQuotationId,
    ...data
  }: SendEmailAndGenerateReportDto) {
    // const [pdfBuffer, versionQuotation] = await new Promise(
    //   async (
    //     resolve: ([document, versionQuotation]: [
    //       Buffer<ArrayBufferLike>,
    //       IVersionQuotationModel
    //     ]) => void,
    //     reject: (error: string) => void
    //   ) => {
    //     switch (resources) {
    //       case AllowVersionQuotationType.TRANSPORTATION:
    //         break;

    //       case AllowVersionQuotationType.ACCOMMODATION:
    //         const versionQuotation = await VersionQuotationModel.findUnique({
    //           where: {
    //             version_number_quotation_id: {
    //               version_number: versionQuotationId!.versionNumber,
    //               quotation_id: versionQuotationId!.quotationId,
    //             },
    //             is_deleted: false,
    //             status: {
    //               not: VersionQuotationStatusEnum.DRAFT,
    //             },
    //           },
    //           include: {
    //             trip_details: {
    //               include: {
    //                 hotel_room_trip_details: {
    //                   orderBy: {
    //                     date: "asc",
    //                   },
    //                   include: {
    //                     hotel_room: {
    //                       include: {
    //                         hotel: true,
    //                       },
    //                     },
    //                   },
    //                 },
    //                 client: true,
    //               },
    //             },
    //             user: true,
    //           },
    //         });

    //         if (!versionQuotation)
    //           return reject("No se encontró la versión de cotización");

    //         const pdfBuffer = await this.versionQuotationPdf.generateForEmail(
    //           versionQuotation
    //         );

    //         resolve([pdfBuffer, versionQuotation as IVersionQuotationModel]);
    //         break;
    //     }
    //   }
    // ).catch((error) => {
    //   throw CustomError.badRequest(`${error}`);
    // });

    const versionQuotation = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number: versionQuotationId!.versionNumber,
          quotation_id: versionQuotationId!.quotationId,
        },
        is_deleted: false,
        status: {
          not: VersionQuotationStatusEnum.DRAFT,
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

    if (!versionQuotation) {
      throw CustomError.badRequest("No se encontró la versión de cotización");
    }

    const pdfBuffer = await this.versionQuotationPdf.generateForEmail(
      versionQuotation
    );

    await this.versionQuotationMailer.sendEmailVQ(
      {
        // serviceType: resources,
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

  /* public async getExcelQuotationById() {
    const versionQuotation = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number: 1,
          quotation_id: 2,
        },
        is_deleted: false,
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
    this.versionQuotationExcel.generateExcel({
      dataQuey: versionQuotation as IVersionQuotationModel,
    });

    return versionQuotation;
  } */

  public async generateExcel({ versionQuotationId }: VersionQuotationIDDto) {
    
     const versionQuotation = await VersionQuotationModel.findUnique({
      where: {
        version_number_quotation_id: {
          version_number: versionQuotationId!.versionNumber,
          quotation_id: versionQuotationId!.quotationId,
        },
        is_deleted: false,
        status: {
          not: VersionQuotationStatusEnum.DRAFT,
        },
      },
      include: {
        trip_details: {
          include: {
            service_trip_details: {
              include: {
                service: {
                  include:{
                    distrit:{
                      include:{
                        city:true
                      }
                    }
                  }
                },
              },
            },
            hotel_room_trip_details: {
              orderBy: {
                date: "asc",
              },
              include: {
                hotel_room: {
                  include: {
                    hotel:{
                      include:{
                        distrit:{
                          include:{
                            city:true
                          }
                        }
                      }
                    },
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

    if (!versionQuotation){
      throw CustomError.badRequest("Versión de cotización no encontrada o no completado");
     }

    return this.versionQuotationExcel.generateExcel({
      dataQuey: versionQuotation as IVersionQuotationModel,
    });


  }
}
