import type { client } from "@prisma/client";
import { ClientEntity } from "@/domain/entities";
import { AppResponse } from "@/presentation/response";

export class ClientResponse {
  clientAlls(clients: client[]): AppResponse<ClientEntity[]> {
    return {
      status: 200,
      message: "list of clients",
      data: clients.map((client) => ClientEntity.fromObject(client)),
    };
  }

  clientCreated(client: client): AppResponse<ClientEntity> {
    return {
      status: 201,
      message: "cliente creado",
      data: ClientEntity.fromObject(client),
    };
  }

  clientUpdated(client: client): AppResponse<ClientEntity> {
    return {
      status: 200,
      message: "cliente actualizado",
      data: ClientEntity.fromObject(client),
    };
  }
}
