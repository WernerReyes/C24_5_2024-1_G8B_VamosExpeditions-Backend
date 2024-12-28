import {
  prisma,
  ReservationDetailModel,
  ReservationModel,
} from "@/data/postgres";

import { ReservationDto } from "@/domain/dtos";
import { ReservationEntity } from "@/domain/entities/reservation.entity";
import { CustomError } from "@/domain/error";
import { ReservationResponse } from "./reservation.response";

export class ReservationService {
  constructor(private reservationResponse: ReservationResponse) {}

  public async registerReservation(reservationDto: ReservationDto) {
    const { destination } = reservationDto;

    try {
      // Iniciar una transacción
      const result = await prisma.$transaction(async (tx) => {
        // Crear la reserva
        const reservation = await ReservationModel.create({
          data: {
            number_of_people: reservationDto.numberOfPeople,
            start_date: reservationDto.startDate,
            end_date: reservationDto.endDate,
            clientId: reservationDto.clientId,
            comfort_level: reservationDto.comfortClass,
            additional_specifications: reservationDto.specialSpecifications,
            code: reservationDto.code,
          },
        });
        /* console.log(reservation); */

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

      const { id } = result;
      const details = await ReservationModel.findUnique({
        where: { id },
        select: {
          id: true,
          number_of_people: true,
          start_date: true,
          end_date: true,
          comfort_level: true,
          additional_specifications: true,
          code: true,
          clientId: true,
          reservation_has_city: {
            select: {
              city: {
                select: {
                  id_city: true,
                  name: true,
                  country: {
                    select: {
                      id_country: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const reservationEntity = ReservationEntity.fromObject(details!);
      console.dir(reservationEntity, { depth: null });
      return this.reservationResponse.reservationCreated(reservationEntity);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
