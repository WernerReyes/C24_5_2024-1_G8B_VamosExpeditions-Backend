import { Validations } from "@/core/utils";


export class  ClienDto{
    constructor(
        public fullName: string,
        public country: string,
        public email: string,
        public phone: string
    ){ }

    static create(props: { [key: string]: any }): [string?, ClienDto?] {
        const { fullName, country, email, phone } = props;

        const error = Validations.validateEmptyFields({ fullName, country, email, phone });
        if (error) return [error, undefined];

        const emailError = Validations.validateEmail(email);
        if (emailError) return [emailError, undefined];


        return [undefined, new ClienDto(fullName.trim().charAt(0).toUpperCase() + fullName.slice(1), country.trim(), email.trim(), phone.trim())];
    }
    
}