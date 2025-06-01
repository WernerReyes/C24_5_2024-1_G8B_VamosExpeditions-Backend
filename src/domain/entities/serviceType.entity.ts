import type { ServiceTypeModel } from "@/infrastructure/models";
import { ServiceEntity } from "./service.entity";

export class ServiceTypeEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly services?: ServiceEntity[]
  ) {}

  public static async fromObject(serviceType: {
    [key: string]: any;
  }): Promise<ServiceTypeEntity> {
    const { id, name, created_at, updated_at, service } =
      serviceType as ServiceTypeModel;
    return new ServiceTypeEntity(
      id,
      name,
      created_at,
      updated_at,
      service
        ? await Promise.all(
            service.map((service) => ServiceEntity.fromObject(service))
          )
        : undefined
    );
  }
}
