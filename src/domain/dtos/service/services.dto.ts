import { Validations } from "@/core/utils";

export class ServiceDto {
  constructor(
    public id: number,
    public description: string,
    public duration: string | undefined,
    public passengersMin: number | undefined,
    public passengersMax: number | undefined,
    public priceUsd: number | undefined,
    public taxIgvUsd: number | undefined,
    public rateUsd: number | undefined,
    public pricePen: number | undefined,
    public taxIgvPen: number | undefined,
    public ratePen: number | undefined,
    public districtId: number,
    public serviceTypeId: number
  ) {}

  static create(props: { [key: string]: any }): [string?, ServiceDto?] {
    const {
      id = 0,
      description,
      duration,
      passengersMin,
      passengersMax,
      priceUsd,
      taxIgvUsd,
      rateUsd,
      pricePen,
      taxIgvPen,
      ratePen,
      districtId,
      serviceTypeId,
    } = props;

    // Validar campos obligatorios
    const emptyError = Validations.validateEmptyFields(
      { description, districtId, serviceTypeId },
      "ServiceDto"
    );
    if (emptyError) return [emptyError, undefined];

    // Validar números
    const numberError = Validations.validateNumberFields({
      id,
      passengersMin,
      passengersMax,
      priceUsd,
      taxIgvUsd,
      rateUsd,
      pricePen,
      taxIgvPen,
      ratePen,
      districtId,
      serviceTypeId,
    });
    if (numberError) return [numberError, undefined];

    // Validar valores mayores o iguales a 0
    const min0Error = Validations.validateGreaterThanValueFields(
      {
        passengersMin,
        passengersMax,
        priceUsd,
        taxIgvUsd,
        rateUsd,
        pricePen,
        taxIgvPen,
        ratePen,
      },
      -1
    );
    if (min0Error) return [min0Error, undefined];

    // Validar valores mayores a 0 en campos obligatorios
    const min1Error = Validations.validateGreaterThanValueFields(
      {
        districtId,
        serviceTypeId,
      },
      0
    );
    if (min1Error) return [min1Error, undefined];

    // Validar id solo si viene definido
    if (id !== 0) {
      const idError = Validations.validateGreaterThanValueFields({ id }, 0);
      if (idError) return [idError, undefined];
    }

    return [
      undefined,
      new ServiceDto(
        +id,
        description,
        duration,
        passengersMin !== undefined ? +passengersMin : undefined,
        passengersMax !== undefined ? +passengersMax : undefined,
        priceUsd !== undefined ? +priceUsd : undefined,
        taxIgvUsd !== undefined ? +taxIgvUsd : undefined,
        rateUsd !== undefined ? +rateUsd : undefined,
        pricePen !== undefined ? +pricePen : undefined,
        taxIgvPen !== undefined ? +taxIgvPen : undefined,
        ratePen !== undefined ? +ratePen : undefined,
        +districtId,
        +serviceTypeId
      ),
    ];
  }
}
