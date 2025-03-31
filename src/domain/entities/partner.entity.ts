import { partner } from "@prisma/client";

type Partner = partner & {};

export class PartnerEntity {
  private constructor(public id: number, public name: string) {}

  public static fromObject({ id, name }: Partner): PartnerEntity {
    return new PartnerEntity(id, name);
  }
}
