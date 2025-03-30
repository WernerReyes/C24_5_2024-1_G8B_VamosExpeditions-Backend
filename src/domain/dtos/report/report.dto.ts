import { Validations } from "@/core/utils";

const ALLOWED_RESERVATION_TYPES = ["Hotel", "Flight", "Tour", "Alojamiento", "Transporte"];
export class Reportdto {
  constructor(
    public readonly subject: string,
    public readonly to: string[],
    public readonly resources: string,
    public readonly reservationId?: number,
    public readonly description?: string
    
    
  ) {}

  static create(props: { [key: string]: any }): [string?, Reportdto?] {
    const { subject, to, resources,  reservationId, description } = props;


    const error = Validations.validateEmptyFields({ subject, to, resources, reservationId });
    if (error) return [error, undefined];

    
    const emailError = Validations.validateArrayEmail(to);
    if (emailError) return [emailError, undefined];

    const resourceError = Validations.validateEnumValue(resources, ALLOWED_RESERVATION_TYPES);
    if (resourceError) return [resourceError, undefined];

    return [undefined, new Reportdto(subject, to, resources, +reservationId,  description)];
  }
}
