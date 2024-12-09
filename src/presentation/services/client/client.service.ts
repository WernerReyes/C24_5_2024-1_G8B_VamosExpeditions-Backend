
import { ClienModel } from "@/data/postgres";
import { ClienDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";
import { ClientResponse } from "./client.response";
import { ClientEntity } from "@/domain/entities";


export class ClientService {
    constructor(
        private clientResponse: ClientResponse
    ) { }

    public async registerClient(clientDto: ClienDto) {
        const client = await ClienModel.findFirst({
            where: {
                email: clientDto.email,
            },


        });

        if (client) throw CustomError.badRequest("El cliente ya existe");

        try {
            const newClient = await ClienModel.create({
                data: {
                    full_name: clientDto.fullName,
                    country: clientDto.country,
                    email: clientDto.email,
                    phone: clientDto.phone
                }
            });

            const clientEntity = ClientEntity.fromObject(newClient);
            return this.clientResponse.clientCreated(clientEntity);

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }



     public  async getClientsAlls  ()  {
         
        try {
            const clients = await ClienModel.findMany();
            const clientsEntity = clients.map(client => ClientEntity.fromObject(client));
            return this.clientResponse.clientAlls(clientsEntity);   
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
     }
}