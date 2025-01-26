import type { client } from "@prisma/client";
import { ClientEntity } from "@/domain/entities";
import { ApiResponse } from "@/presentation/response";

export class ClientResponse {
  clientAlls(clients: client[]): ApiResponse<ClientEntity[]> {
    return {
      status: 200,
      message: "list of clients",
      data: clients.map((client) => ClientEntity.fromObject(client)),
    };
  }

  clientUpserted(client: client, id?: number): ApiResponse<ClientEntity> {
    return new ApiResponse<ClientEntity>(
      200,
      !id || id === 0
        ? "Cliente creado correctamente"
        : "Cliente actualizado correctamente",
      ClientEntity.fromObject(client)
    );
  }
}
