import { Prisma, PrismaClient, type partner } from "@prisma/client";
import { Model } from "./model";

export interface IPartnerModel extends partner {}

export class PartnerModel extends Model<IPartnerModel> implements IPartnerModel {
  private static partner = new PrismaClient().partner;
  private static _instance: PartnerModel;

  public static modelName = Prisma.ModelName.partner;

  protected override get getEmpty(): PartnerModel {
    return PartnerModel._instance;
  }

  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly deleted_at: Date | null,
    public readonly is_deleted: boolean,
    public readonly delete_reason: string | null = null
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new PartnerModel(
      0,
      "",
      new Date(0),
      new Date(0),
      null,
      false,
      null
    );
  }

  public static get instance(): PartnerModel {
    return this._instance;
  }

  public static get partialInstance(): PartnerModel {
    return new PartnerModel(
      this._instance.id,
      this._instance.name,
      this._instance.created_at,
      this._instance.updated_at,
      this._instance.deleted_at,
      this._instance.is_deleted,
      this._instance.delete_reason
    );
  }

  public static get getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.partnerFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerFindManyArgs>
  ): Promise<Prisma.partnerGetPayload<T>[]> {
    return await this.partner.findMany(args);
  }

  public static async findFirst<T extends Prisma.partnerFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerFindFirstArgs>
  ): Promise<Prisma.partnerGetPayload<T> | null> {
    return await this.partner.findFirst(args);
  }

  public static async findUnique<T extends Prisma.partnerFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerFindUniqueArgs>
  ): Promise<Prisma.partnerGetPayload<T> | null> {
    return await this.partner.findUnique(args);
  }

  public static async create<T extends Prisma.partnerCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerCreateArgs>
  ): Promise<Prisma.partnerGetPayload<T>> {
    return await this.partner.create(args);
  }

  public static async createMany<T extends Prisma.partnerCreateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerCreateManyArgs>
  ): Promise<Prisma.BatchPayload> {
    return await this.partner.createMany(args);
  }

  public static async update<T extends Prisma.partnerUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerUpdateArgs>
  ): Promise<Prisma.partnerGetPayload<T>> {
    return await this.partner.update(args);
  }

  public static async delete<T extends Prisma.partnerDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerDeleteArgs>
  ): Promise<Prisma.partnerGetPayload<T>> {
    return await this.partner.delete(args);
  }

  public static async count<T extends Prisma.partnerCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerCountArgs>
  ): Promise<number> {
    const result = await this.partner.count(args);
    return typeof result === "number" ? result : 0;
  }

  public static async upsert<T extends Prisma.partnerUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.partnerUpsertArgs>
  ): Promise<Prisma.partnerGetPayload<T>> {
    return await this.partner.upsert(args);
  }
}
