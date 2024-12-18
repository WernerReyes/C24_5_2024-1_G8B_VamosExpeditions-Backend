import { ReservationDetailModel, ReservationModel } from "@/data/postgres"
import { ReservationDto } from "@/domain/dtos";
import { ReservationEntity } from "@/domain/entities/reservation.entity";
import { CustomError } from "@/domain/error";
import { ReservationResponse } from "./reservation.response";

export class ReservationService {

    constructor(
       private reservationResponse:ReservationResponse
    ) { }

    public async registerReservation(reservationDto:ReservationDto) {
       const { destination}=reservationDto;

        try {
           
            const reservation = await ReservationModel.create({
                data: {
                    number_of_people:reservationDto.numberOfPeople,
                    start_date: reservationDto.startDate,
                    end_date: reservationDto.endDate,
                    clientId: reservationDto.clientId,
                    comfort_level: reservationDto.comfortClass,            
                    additional_specifications:reservationDto.specialSpecifications,
                    code: reservationDto.code,
                }
            });

            const { id } = reservation;
            
            // Procesar los destinos
            const keys = Object.keys(destination);
            const result = keys.map(item => +item); 
            
            
            for (const element of result) {
                try {
                    await ReservationDetailModel.create({
                        data: {
                            city_id: element,
                            reservation_id: id,
                        }
                    });
                } catch (error) {
                    console.error(`Error inserting reservation detail for city ${element}:`, error);
                }
            }
            const reservationEntity = ReservationEntity.fromObject(reservation);
            return  this.reservationResponse.reservationCreated(reservationEntity);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
