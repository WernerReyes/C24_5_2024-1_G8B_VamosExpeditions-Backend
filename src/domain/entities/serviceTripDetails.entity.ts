import type { IServiceTripDetailsModel } from "@/infrastructure/models";
import { ServiceEntity } from "./service.entity";

export class ServiceTripDetailsEntity {
  constructor(
    public readonly id: number,
    public readonly date: Date,
    public readonly costPerson: number,
    public readonly service?: ServiceEntity
  ) {}

  public static async fromObject(serviceTripDetails: {
    [key: string]: any;
  }): Promise<ServiceTripDetailsEntity> {
    const { id, date, cost_person, service } =
      serviceTripDetails as IServiceTripDetailsModel;

    return new ServiceTripDetailsEntity(
      id,
      date,
      Number(cost_person),
      service ? await ServiceEntity.fromObject(service) : undefined
    );
  }
}
