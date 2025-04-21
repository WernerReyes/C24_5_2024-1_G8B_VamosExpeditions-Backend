import { Validations } from "@/core/utils";

export class HotelDto {


  constructor(
    public category: string,
    public name: string,
    public address: string,
    public district: string
  ) {}

  static create(props: { [key: string]: any }): [string?,HotelDto?] {
    const { category, name, address, district } = props;

    const error = Validations.validateEmptyFields(
      { category, name, address, district },
      "HotelDto"
    );
    if (error) return [error, undefined];

    return [undefined, new HotelDto(category, name, address, district)];
  }



}
