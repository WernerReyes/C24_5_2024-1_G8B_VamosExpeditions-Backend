import { Validations } from "@/core/utils";
import { CustomError } from "../error";


export class ClientEntity {

    constructor(
        public readonly id: number,
        public readonly fullName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly country: string
    ) {}

    public static fromObject(object: { [key: string]: any }): ClientEntity {
        const { id, fullName, email, phone, country } = object;

        const error = Validations.validateEmptyFields({
            id,
            fullName,
            email,
            phone,
            country
        });

        if (error) throw CustomError.badRequest(error);

        return new ClientEntity(id, fullName, email, phone, country);
    }
}
