import { Validations } from "@/core/utils";
import { DistritEntity } from "./distrit.entity";
import { CustomError } from "../error";

export class AccommodationEntity {
  private constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly category: string,
    private readonly address: string,
    private readonly rating: number,
    private readonly email: string,
    private readonly distrit: DistritEntity
  ) {}

  public static fromObject(object: {
    [key: string]: any;
  }): AccommodationEntity {
    const {
      distrit,
      id_accommodation,
      name,
      category,
      address,
      rating,
      email,
      distrit_id_distrit,
    } = object;
    const error = Validations.validateEmptyFields({
      distrit,
      id_accommodation,
      name,
      category,
      address,
      rating,
      email,
      distrit_id_distrit,
    });
    if (error) throw CustomError.badRequest(error);

    const distritEntity = DistritEntity.fromObject(distrit);

    return new AccommodationEntity(
      object.id,
      object.name,
      object.category,
      object.address,
      object.rating,
      object.email,
      distritEntity
    );
  }
}
