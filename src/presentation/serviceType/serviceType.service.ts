import type { GetServiceTypesDto } from "@/domain/dtos";
import { ServiceTypeEntity } from "@/domain/entities/serviceType.entity";
import { ServiceTypeModel } from "@/infrastructure/models";
import { ApiResponse, PaginatedResponse } from "../response";
import { ServiceTypeMapper } from "./serviceType.mapper";

export class ServiceTypeService {
  constructor(private readonly serviceTypeMapper: ServiceTypeMapper) {}

  public async getAll(getServiceTypesDto: GetServiceTypesDto) {
    const { page, limit } = getServiceTypesDto;
    this.serviceTypeMapper.setDto = getServiceTypesDto;
    const [serviceTypes, total] = await Promise.all([
      ServiceTypeModel.serviceType.findMany({
        select: this.serviceTypeMapper.toSelect,
        orderBy: {
          created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      ServiceTypeModel.serviceType.count(),
    ]);

    return new ApiResponse<PaginatedResponse<ServiceTypeEntity>>(
      200,
      "Tipos de servicio encontrados",
      new PaginatedResponse(
        await Promise.all(
          serviceTypes.map((serviceType) =>
            ServiceTypeEntity.fromObject(serviceType)
          )
        ),
        page,
        Math.ceil(total / limit),
        total,
        limit
      )
    );
  }
}
