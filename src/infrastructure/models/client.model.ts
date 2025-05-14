import { client, Prisma, PrismaClient } from "@prisma/client";
import { Model } from "./model";

export interface IClientModel extends client {}

export class ClientModel extends Model<IClientModel> implements IClientModel {
  private static client = new PrismaClient().client;

  private static _instance: ClientModel

  public static modelName = Prisma.ModelName.client;

  protected override get getEmpty(): ClientModel {
    return ClientModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly fullName: string,
    public readonly country: string,
    public readonly subregion: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new ClientModel(
      0,
      "",
      "",
      "",
      "",
      "",
      new Date(0),
      new Date(0)
    );
  }

  public static get instance(): ClientModel {
    return this._instance;
  }

  public static get partialInstance(): ClientModel {
    return new ClientModel(
      this._instance.id,
      this._instance.fullName,
      this._instance.country,
      this._instance.subregion,
      this._instance.email,
      this._instance.phone,
      this._instance.createdAt,
      this._instance.updatedAt
    );
  }

  

  public static getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.clientFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.clientFindManyArgs>
  ): Promise<Prisma.clientGetPayload<T>[]> {
    return await this.client.findMany(args);
  }

  public static async findUnique<T extends Prisma.clientFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.clientFindUniqueArgs>
  ): Promise<Prisma.clientGetPayload<T> | null> {
    return await this.client.findUnique(args);
  }

  public static async upsert<T extends Prisma.clientUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.clientUpsertArgs>
  ): Promise<Prisma.clientGetPayload<T>> {
    return await this.client.upsert(args);
  }

  public static async create<T extends Prisma.clientCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.clientCreateArgs>
  ): Promise<Prisma.clientGetPayload<T>> {
    return await this.client.create(args);
  }

  public static async update<T extends Prisma.clientUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.clientUpdateArgs>
  ): Promise<Prisma.clientGetPayload<T>> {
    return await this.client.update(args);
  }

  public static async delete<T extends Prisma.clientDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.clientDeleteArgs>
  ): Promise<Prisma.clientGetPayload<T>> {
    return await this.client.delete(args);
  }
}
