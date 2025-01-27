import { Validations } from "@/core/utils";
import {
  ClientEntity,
  OrderType,
  ReservationStatus,
  TravelerStyle,
} from "@/domain/entities";

const FROM = "ReservationDto";
export class ReservationDto {
  private constructor(
    public readonly client: ClientEntity,
    public readonly numberOfPeople: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly code: string,
    public readonly status: ReservationStatus,
    public readonly travelerStyle: TravelerStyle,
    public readonly orderType: OrderType,
    public readonly destination: { [key: number]: boolean },
    public readonly specialSpecifications?: string,
    public readonly id?: number
  ) {}

  static create(props: { [key: string]: any }): [string?, ReservationDto?] {
    const {
      client,
      numberOfPeople,
      travelDates,
      code,
      travelerStyle,
      orderType,
      destination,
      status,
      specialSpecifications,
      id = 0,
    } = props;

    // Validar campos vacíos
    const error = Validations.validateEmptyFields(
      {
        client,
        numberOfPeople,
        travelDates,
        code,
        travelerStyle,
        orderType,
        destination,
        specialSpecifications,
        status: ReservationStatus.PENDING,
      },
      FROM
    );
    if (error) return [error, undefined];

    const errorNumber = Validations.validateNumberFields({
      numberOfPeople,
    });
    if (errorNumber) return [errorNumber, undefined];

    const lengthError = Validations.validateDateArray(travelDates);
    if (lengthError) return [lengthError, undefined];

    const errorTravelerStyle = Validations.validateEnumValue(
      travelerStyle,
      Object.values(TravelerStyle)
    );
    if (errorTravelerStyle) return [errorTravelerStyle, undefined];

    const errorStatus = Validations.validateEnumValue(
      status,
      Object.values(ReservationStatus)
    );

    const errorOrderType = Validations.validateEnumValue(
      orderType,
      Object.values(OrderType)
    );
    if (errorOrderType) return [errorOrderType, undefined];

    const clientEntityError = ClientEntity.validateEntity(client, FROM);
    if (clientEntityError) return [clientEntityError, undefined];

    if (id !== 0) {
      const errorId = Validations.validateNumberFields({ id });
      if (errorId) return [errorId, undefined];
    }

    return [
      undefined,
      new ReservationDto(
        client,
        +numberOfPeople,
        new Date(travelDates[0]),
        new Date(travelDates[1]),
        code,
        status,
        travelerStyle,
        orderType,
        destination,
        specialSpecifications,
        +id
      ),
    ];
  }
}
