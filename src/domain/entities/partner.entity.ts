import type { IPartnerModel } from "@/infrastructure/models";
export class PartnerEntity {
  private constructor(
    public readonly id: number,
    public readonly name: string
  ) {}

  public static fromObject(partner: { [key: string]: any }): PartnerEntity {
    const { id, name } = partner as IPartnerModel;
    return new PartnerEntity(id, name);
  }
}
