import { ClientModel } from "@/data/postgres";
import { ClientDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ClientMapper } from "./client.mapper";
import { ApiResponse } from "../response";
import { ClientEntity } from "@/domain/entities";

export class ClientService {
  constructor(private readonly clientMapper: ClientMapper) {}

  public async upsertClient(clientDto: ClientDto) {
    this.clientMapper.setDto = clientDto;

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
    const clients = await ClientModel.findMany();
    return new ApiResponse<ClientEntity[]>(
      200,
      "lista de clientes",
      await Promise.all(clients.map((client) => ClientEntity.fromObject(client)))
    );
  }
}
