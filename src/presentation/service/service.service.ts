import type { GetServicesDto } from "@/domain/dtos";
import { ServiceEntity } from "@/domain/entities/service.entity";
import { ServiceModel } from "@/infrastructure/models";
import { ApiResponse, PaginatedResponse } from "../response";
import { ServiceMapper } from "./service.mapper";

export class ServiceService {
  constructor(private readonly serviceMapper: ServiceMapper) {}

  public async getAll(getServicesDto: GetServicesDto) {
    const { page, limit } = getServicesDto;
    this.serviceMapper.setDto = getServicesDto;
    const [services, total] = await Promise.all([
      ServiceModel.findMany({
        select: this.serviceMapper.toSelect,
        where: this.serviceMapper.filters,
        orderBy: {
          created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      ServiceModel.count({
        where: this.serviceMapper.filters,
      }),
    ]);

    return new ApiResponse<PaginatedResponse<ServiceEntity>>(
      200,
      "Servicios encontrados",
      new PaginatedResponse(
        await Promise.all(
          services.map((service) => ServiceEntity.fromObject(service))
        ),
        page,
        Math.ceil(total / limit),
        total,
        limit
      )
    );
  }
}
