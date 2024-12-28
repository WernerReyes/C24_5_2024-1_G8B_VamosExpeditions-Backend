import { ReservationModel } from "@/data/postgres";
import { ReservationDto } from "@/domain/dtos";

export class ReservationMapper {
  public create = (reservationDto: ReservationDto) => {
    return ReservationModel.create({
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
  };
}
