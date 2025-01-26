import { ClientDto } from "@/domain/dtos";
import { ClientModel } from "@/data/postgres";
import { ClientResponse } from "./client.response";
import { CustomError } from "@/domain/error";
import { ClientMapper } from "./client.mapper";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class ClientService {
  constructor(
    private readonly clientMapper: ClientMapper,
    private readonly clientResponse: ClientResponse
  ) {}

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

    return this.clientResponse.clientUpserted(newClient, clientDto.id);
  }

  public async getClientsAlls() {
    try {
      const clients = await ClientModel.findMany();
      return this.clientResponse.clientAlls(clients);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
