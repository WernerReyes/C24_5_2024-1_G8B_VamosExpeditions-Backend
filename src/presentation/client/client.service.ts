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

  public async createClient(clientDto: ClientDto) {
    const client = await ClienModel.findUnique({
      where: {
        email: clientDto.email,
      },
    });

    if (client) throw CustomError.badRequest("El cliente ya existe");

    try {
      const newClient = await ClienModel.create({
        data: this.clientMapper.toRegister(clientDto),
      });
      return this.clientResponse.clientCreated(newClient);
    } catch (error) {
      console.error(`Error inserting client:`, error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async updateClient(id: number, clientDto: ClientDto) {
    const client = await ClienModel.findUnique({
      where: {
        id,
      },
    });

    if (!client) throw CustomError.badRequest("El cliente no existe");

    if (client.email !== clientDto.email) {
      const clientEmail = await ClienModel.findUnique({
        where: {
          email: clientDto.email,
        },
      });
      if (clientEmail) throw CustomError.badRequest("El email ya existe");
    }

    try {
      const newClient = await ClienModel.update({
        where: {
          id,
        },
        data: this.clientMapper.toRegister(clientDto),
      });
      return this.clientResponse.clientUpdated(newClient);
    } catch (error) {
      console.error(`Error updating client:`, error);
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
