import { ClientEntity } from "@/domain/entities";
import { AppResponse } from "@/presentation/response";



export class ClientResponse {


  clientAlls(
    clients: ClientEntity[],
  ): AppResponse<ClientEntity[] > {
    return {
      status: 200,
      message: "list of clients",
      data: clients,
    };
  }

  clientCreated(
    client: ClientEntity,
  ): AppResponse<ClientEntity> {
    return {
      status: 201,
      message: "Client created",
      data: client,
    };
  }



  
}