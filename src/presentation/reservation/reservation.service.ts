import {
  ClientModel,
  prisma,
  ReservationHasCityModel,
  ReservationModel,
} from "@/data/postgres";
import { GetReservationsDto, ReservationDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { ReservationResponse } from "./reservation.response";
import { ReservationMapper } from "./reservation.mapper";
export class ReservationService {
  constructor(
    private reservationMapper: ReservationMapper,
    private reservationResponse: ReservationResponse
  ) {}

  public async upsertReservation(reservationDto: ReservationDto) {
    const clientExists = await ClientModel.findUnique({
      where: { id: reservationDto.client.id },
    });

    if (!clientExists) throw CustomError.notFound("Client not found");

    this.reservationMapper.setDto = reservationDto;

    const [_, reservation] = await prisma
      .$transaction([
        ReservationHasCityModel.deleteMany({
          where: { reservation_id: reservationDto.id },
        }),
        ReservationModel.upsert({
          where: { id: reservationDto.id },
          create: this.reservationMapper.toUpsert,
          update: this.reservationMapper.toUpsert,
          include: this.reservationMapper.toSelectInclude,
        }),
      ])
      .catch((error) => {
        throw CustomError.internalServer(`${error}`);
      });

    // try {
    //   const reservation = await ReservationModel.upsert({
    //     where: { id: reservationDto.id },
    //     create: this.reservationMapper.toUpsert,
    //     update: this.reservationMapper.toUpsert,
    //     include: this.reservationMapper.toSelectInclude,
    //   });

    return this.reservationResponse.reservationUpserted(
      reservation,
      reservationDto.id
    );
    // } catch (error) {
    //   console.log("error", error);
    //   throw CustomError.internalServer(`${error}`);
    // }
  }

  public async getReservationById(id: number) {
    const reservation = await ReservationModel.findUnique({
      where: { id },
      include: this.reservationMapper.toSelectInclude,
    });
    if (!reservation) throw CustomError.notFound("Reservation not found");
    return this.reservationResponse.reservationFound(reservation);
  }

  public async getReservations({
    status,
    versionQuotationId,
  }: GetReservationsDto) {
    try {
      const whereCondition = status || versionQuotationId
        ? {
            OR: [
              ...(status ? [{ status: status as any }] : []),
              ...(versionQuotationId
                ? [
                    {
                      version_quotation: {
                        quotation_id: { equals: versionQuotationId.quotationId },
                        version_number: {
                          equals: versionQuotationId.versionNumber,
                        },
                      },
                    },
                  ]
                : []),
            ],
          }
        : {}; // Si no hay filtros, se usa un objeto vacío para traer todo
  
      const reservations = await ReservationModel.findMany({
        where: whereCondition,
        include: this.reservationMapper.toSelectInclude,
      });
  
      return this.reservationResponse.reservationsFound(reservations);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}  