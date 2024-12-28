import {
  prisma,
  ReservationDetailModel,
  ReservationModel,
} from "@/data/postgres";
import { ReservationDto } from "@/domain/dtos";
import { ReservationEntity } from "@/domain/entities/reservation.entity";
import { CustomError } from "@/domain/error";
import { ReservationResponse } from "./reservation.response";
import { ReservationMapper } from "./reservation.mapper";

export class ReservationService {
  constructor(
    private reservationMapper: ReservationMapper,
    private reservationResponse: ReservationResponse
  ) {}

  public async registerReservation(reservationDto: ReservationDto) {
    const { destination } = reservationDto;

    try {
      // Iniciar una transacción
      const result = await prisma.$transaction(async (tx) => {
        // Crear la reserva
        const reservation = await this.reservationMapper.create(
          reservationDto
        );

        const { id } = reservation;

        // Procesar los destinos
        const keys = Object.keys(destination).map((key) => +key);

        // Crear los detalles de la reserva
        for (const cityId of keys) {
          await ReservationDetailModel.create({
            data: {
              city_id: cityId,
              reservation_id: id,
            },
          });
        }

        // Retornar la reserva creada
        return reservation;
      });

      const reservationEntity = ReservationEntity.fromObject(result);
      return this.reservationResponse.reservationCreated(reservationEntity);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }


  public async getReservationById(id: number) {
    const reservation = await ReservationModel.findFirst({
      where: {
        id,
      },
      include: {
        reservation_has_city: {
            include: {
                city: {
                include: {
                    country: true,
                },
                },
            },
            },
      },
    });

    if (!reservation) {
      throw CustomError.notFound("Reserva no encontrada");
    }

    return reservation
  }

}
