import { Validations } from "@/core/utils";


export class ReservationDto {


    constructor(
        public readonly clientId: number,
        public readonly numberOfPeople: number,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly code: string,
        public readonly comfortClass: string,
        public readonly destination: { [key: number]: boolean },
        public readonly specialSpecifications?: string,
    ) { }


    static create(props: { [key: string]: any }): [string?, ReservationDto?] {
 

            const {
                clientId,
                numberOfPeople,
                travelDates,
                code,
                comfortClass,
                destination,
                specialSpecifications,
            } = props;
    
            // Validar campos vacíos
            const error = Validations.validateEmptyFields({
                clientId,
                numberOfPeople,
                travelDates,
                code,
                comfortClass,
                destination,
                specialSpecifications,
            });
            if (error) return [error, undefined];

       const lengthError = Validations.validateDateArray(travelDates)
        if (lengthError) return [lengthError, undefined];
       
        const startDate = new Date(travelDates[0]);
        const endDate = new Date(travelDates[1]);

        return [undefined,
            new ReservationDto(
                +clientId,
                +numberOfPeople,
                startDate,
                endDate,
                code,
                comfortClass,
                destination,
                specialSpecifications || undefined
            )];


    }
}