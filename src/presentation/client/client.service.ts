import { ClientDto, GetClientsDto, TrashDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ClientMapper } from "./client.mapper";
import { ApiResponse, PaginatedResponse } from "../response";
import { ClientEntity } from "@/domain/entities";
import { ClientModel } from "@/infrastructure/models";

export class ClientService {
  constructor(private readonly clientMapper: ClientMapper) {}

  public async upsertClient(clientDto: ClientDto) {
    this.clientMapper.setDto = clientDto;
    if (!clientDto.id || clientDto.id === 0) {
      const clientExists = await ClientModel.findFirst({
        where: { email: clientDto.email },
      });
      if (clientExists) {
        throw CustomError.badRequest("El cliente ya existe con ese email");
      }
    }

    const newClient = await ClientModel.upsert({
      where: { id: clientDto.id },
      create: this.clientMapper.toUpsert,
      update: this.clientMapper.toUpsert,
      include: this.clientMapper.toSelectInclude,
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2002") {
        throw CustomError.badRequest("El email ya existe");
      }
      throw CustomError.internalServer(`${error}`);
    });

    return new ApiResponse<ClientEntity>(
      200,
      !clientDto.id || clientDto.id === 0
        ? "Cliente creado correctamente"
        : "Cliente actualizado correctamente",
      await ClientEntity.fromObject(newClient)
    );
  }

  public async getClientsAlls() {
    const clients = await ClientModel.findMany({});
    return new ApiResponse<ClientEntity[]>(
      200,
      "lista de clientes",
      await Promise.all(
        clients.map((client) => ClientEntity.fromObject(client))
      )
    );
  }

  public async getClients(getClientsDto: GetClientsDto) {
    const { page, limit } = getClientsDto;
    this.clientMapper.setDto = getClientsDto;

    const clients = await ClientModel.findMany({
      select: this.clientMapper.toSelect,
      where: this.clientMapper.filters,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    

    const totalClients = await ClientModel.count({
      where: this.clientMapper.filters,
    });

    return new ApiResponse<PaginatedResponse<ClientEntity>>(
      200,
      "Clientes encontrados",
      new PaginatedResponse(
        await Promise.all(
          clients.map((client) => ClientEntity.fromObject(client))
        ),
        page,
        Math.ceil(totalClients / limit),
        totalClients,
        limit
      )
    );
  }

  public async trashClient({ id, deleteReason }: TrashDto) {
    const client = await ClientModel.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        is_deleted: true,
      },
    });

    if (!client)
      throw CustomError.notFound(`No se encontró el cliente con id ${id}`);

    const clientDeleted = await ClientModel.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: client.is_deleted ? null : new Date(),
        is_deleted: !client.is_deleted,
        delete_reason: client.is_deleted ? null : deleteReason,
      },
    });

    return new ApiResponse<ClientEntity>(
      200,
      client.is_deleted
        ? "Cliente restaurado correctamente"
        : "Cliente eliminado correctamente",
      await ClientEntity.fromObject(clientDeleted)
    );
  }

  public async restoreClient(id: number) {
    return this.trashClient({ id, deleteReason: undefined });
  }
}
