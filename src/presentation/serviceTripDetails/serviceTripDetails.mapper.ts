import { DateAdapter } from "@/core/adapters";
import { Validations } from "@/core/utils";
import { type InsertManyServiceTripDetailsDto } from "@/domain/dtos";
import { Prisma } from "@prisma/client";

type Dto = InsertManyServiceTripDetailsDto;

const FROM = "ServiceTripDetailsMapper";
export class ServiceTripDetailsMapper {
  private dto: Dto;
  constructor() {
    this.dto = {} as Dto;
  }

  public set setDto(dto: Dto) {
    this.dto = dto;
  }

  public get createMany(): Prisma.service_trip_detailsCreateManyInput[] {
    this.validateModelInstance(this.dto, "createMany");
    const dto = this.dto as InsertManyServiceTripDetailsDto;
    const dates = DateAdapter.eachDayOfInterval(
      dto.dateRange[0],
      dto.dateRange[1]
    );

    const dataToInsert = dates.flatMap((date) => {
      return Array.from({ length: dto.countPerDay }, () => ({
        service_id: dto.serviceId,
        trip_details_id: dto.tripDetailsId,
        date,
        cost_person: dto.costPerson,
      }));
    });

    return dataToInsert;
  }

  private validateModelInstance(models: any[] | any, methodName: string): void {
    Validations.validateModelInstance(models, `${FROM}.${methodName}`);
  }
}
