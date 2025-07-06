import type { GetServicesDto, ServiceDto } from "@/domain/dtos";
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
    /* const data = await services.map((service) => ServiceEntity.fromObject(service));
    console.log("ServiceMapper.toSelect", data); */
   
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
  public async upsertService(serviceDto: ServiceDto) {
  this.serviceMapper.setDto = serviceDto;

  const existingService = await ServiceModel.findUnique({
    where: { id: serviceDto.id },
  });

  const serviceData = existingService
    ? await ServiceModel.update({
        where: { id: serviceDto.id },
        data: this.serviceMapper.updateService,
      })
    : await ServiceModel.create({
        data: this.serviceMapper.createService,
      });

  return new ApiResponse(
    200,
    existingService ? "Servicio actualizado" : "Servicio creado",
    serviceData
  );
}


    



  
   






}
