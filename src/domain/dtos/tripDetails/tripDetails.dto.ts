import { Validations } from "@/core/utils";
import {
  OrderType,
  TravelerStyle
} from "@/domain/entities";
import { VersionQuotationIDDto } from "../common/versionQuotationID.dto";

const FROM = "TripDetailsDto";
export class TripDetailsDto extends VersionQuotationIDDto {
  private constructor(
    public readonly versionQuotationId: {
      quotationId: number;
      versionNumber: number;
    },
    public readonly clientId: number,
    public readonly numberOfPeople: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly code: string,
    public readonly travelerStyle: TravelerStyle,
    public readonly orderType: OrderType,
    public readonly destination: { [key: number]: boolean },
    public readonly specialSpecifications?: string,
    public readonly id?: number
  ) {
    super(versionQuotationId);
  }

  static create(props: { [key: string]: any }): [string?, TripDetailsDto?] {
    const {
      versionQuotationId,
      clientId,
      numberOfPeople,
      travelDates,
      code,
      travelerStyle,
      orderType,
      destination,
      specialSpecifications,
      id = 0,
    } = props;

    // Validar campos vacíos
    const error = Validations.validateEmptyFields(
      {
        clientId,
        numberOfPeople,
        travelDates,
        code,
        travelerStyle,
        orderType,
        destination,
        specialSpecifications,
      },
      FROM
    );
    if (error) return [error, undefined];

    const [errorDto, dto] = VersionQuotationIDDto.create(versionQuotationId);
    if (errorDto) return [errorDto, undefined];

    const errorNumber = Validations.validateNumberFields({
      numberOfPeople,
      clientId,
    });
    if (errorNumber) return [errorNumber, undefined];

    const lengthError = Validations.validateDateArray(travelDates);
    if (lengthError) return [lengthError, undefined];

    const errorTravelerStyle = Validations.validateEnumValue(
      travelerStyle,
      Object.values(TravelerStyle)
    );
    if (errorTravelerStyle) return [errorTravelerStyle, undefined];

    const errorOrderType = Validations.validateEnumValue(
      orderType,
      Object.values(OrderType)
    );
    if (errorOrderType) return [errorOrderType, undefined];

    if (id !== 0) {
      const errorId = Validations.validateNumberFields({ id });
      if (errorId) return [errorId, undefined];
    }

    return [
      undefined,
      new TripDetailsDto(
        dto?.versionQuotationId!,
        +clientId,
        +numberOfPeople,
        new Date(travelDates[0]),
        new Date(travelDates[1]),
        code,
        travelerStyle,
        orderType,
        destination,
        specialSpecifications,
        +id
      ),
    ];
  }
}
