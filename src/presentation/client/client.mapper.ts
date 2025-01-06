import { ClientDto } from "@/domain/dtos";

export class ClientMapper {
  public toRegister(ClientDto: ClientDto) {
    return {
      fullName: ClientDto.fullName,
      country: ClientDto.country.name,
      email: ClientDto.email,
      phone: ClientDto.phone,
      continent: ClientDto.country.continent,
    };
  }
}
