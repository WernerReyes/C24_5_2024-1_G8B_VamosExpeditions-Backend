import { ClientDto } from "@/domain/dtos";
import { ClienModel } from "@/data/postgres";
import { ClientResponse } from "./client.response";
import { CustomError } from "@/domain/error";
import { ClientMapper } from "./client.mapper";

export class ClientService {
  constructor(
    private readonly clientMapper: ClientMapper,
    private readonly clientResponse: ClientResponse
  ) {}

  public async registerClient(ClientDto: ClientDto) {
    const client = await ClienModel.findFirst({
      where: {
        email: ClientDto.email,
      },
    });

    if (client) throw CustomError.badRequest("El cliente ya existe");

    try {
      const newClient = await ClienModel.create({
        data: this.clientMapper.toRegister(ClientDto),
      });
      return this.clientResponse.clientCreated(newClient);
    } catch (error) {
      console.error(`Error inserting client:`, error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getClientsAlls() {
    try {
      const clients = await ClienModel.findMany();
      return this.clientResponse.clientAlls(clients);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
