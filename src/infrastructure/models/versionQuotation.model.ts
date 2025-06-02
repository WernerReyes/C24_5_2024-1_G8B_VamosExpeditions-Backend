import {
  Prisma,
  version_quotation_status,
  type version_quotation,
} from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
import { Model, prisma } from "./model";
import { type IPartnerModel } from "./partner.model";
import { type IQuotationModel } from "./quotation.model";
import { type ITripDetailsModel } from "./tripDetails.model";
import { type IUserModel } from "./user.model";

export interface IVersionQuotationModel extends version_quotation {
  user?: IUserModel;
  trip_details?: ITripDetailsModel | null;
  quotation?: IQuotationModel;
  partners?: IPartnerModel | null;
}

export class VersionQuotationModel
  extends Model<IVersionQuotationModel>
  implements IVersionQuotationModel
{
  public static version_quotation = prisma.version_quotation;

  public static modelName = Prisma.ModelName.version_quotation;

  private static _instance: VersionQuotationModel;

  protected override get getEmpty(): VersionQuotationModel {
    return VersionQuotationModel._instance;
  }

  constructor(
    public readonly version_number: number,
    public readonly quotation_id: number,
    public readonly indirect_cost_margin: Decimal | null,
    public readonly name: string,
    public readonly profit_margin: Decimal | null,
    public readonly final_price: Decimal | null,
    public readonly official: boolean,
    public readonly user_id: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly status: version_quotation_status,
    public readonly completion_percentage: number,
    public readonly commission: Decimal | null,
    public readonly partner_id: number | null,
    public readonly is_deleted: boolean,
    public readonly deleted_at: Date | null,
    public readonly delete_reason: string | null,
    public user?: IUserModel,
    public trip_details?: ITripDetailsModel | null,
    public quotation?: IQuotationModel,
    public partners?: IPartnerModel | null
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new VersionQuotationModel(
      0,
      0,
      null,
      "",
      null,
      null,
      false,
      0,
      new Date(0),
      new Date(0),
      "" as version_quotation_status,
      0,
      null,
      null,
      false,
      null,
      null
    );
  }

  public static get instance(): VersionQuotationModel {
    return this._instance;
  }

  public static get partialInstance(): VersionQuotationModel {
    return new VersionQuotationModel(
      this._instance.version_number,
      this._instance.quotation_id,
      this._instance.indirect_cost_margin,
      this._instance.name,
      this._instance.profit_margin,
      this._instance.final_price,
      this._instance.official,
      this._instance.user_id,
      this._instance.created_at,
      this._instance.updated_at,
      this._instance.status,
      this._instance.completion_percentage,
      this._instance.commission,
      this._instance.partner_id,
      this._instance.is_deleted,
      this._instance.deleted_at,
      this._instance.delete_reason
    );
  }

  public static set user(user: IUserModel) {
    this._instance.user = user;
  }

  public static set setTripDetails(tripDetails: ITripDetailsModel) {
    this._instance.trip_details = tripDetails;
  }

  public static set setQuotation(quotation: IQuotationModel) {
    this._instance.quotation = quotation;
  }

  public static set setUser(user: IUserModel) {
    this._instance.user = user;
  }

  public static set setPartners(partners: IPartnerModel) {
    this._instance.partners = partners;
  }

  public static set setRelationship(
    relationship: Pick<
      IVersionQuotationModel,
      "user" | "trip_details" | "quotation" | "partners"
    >
  ) {
    Object.assign(this._instance, relationship);
  }

  public static get getString() {
    return this._instance.getString();
  }

  public static async findUnique<
    T extends Prisma.version_quotationFindUniqueArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.version_quotationFindUniqueArgs>
  ): Promise<Prisma.version_quotationGetPayload<T> | null> {
    return await this.version_quotation.findUnique(args);
  }

  public static async findFirst<
    T extends Prisma.version_quotationFindFirstArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.version_quotationFindFirstArgs>
  ): Promise<Prisma.version_quotationGetPayload<T> | null> {
    return await this.version_quotation.findFirst(args);
  }

  public static async findMany<T extends Prisma.version_quotationFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.version_quotationFindManyArgs>
  ): Promise<Prisma.version_quotationGetPayload<T>[]> {
    return await this.version_quotation.findMany(args);
  }

  public static async update<T extends Prisma.version_quotationUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.version_quotationUpdateArgs>
  ): Promise<Prisma.version_quotationGetPayload<T>> {
    return await this.version_quotation.update(args);
  }

  public static async count<T extends Prisma.version_quotationCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.version_quotationCountArgs>
  ): Promise<number> {
    const count = await this.version_quotation.count(args);
    return typeof count === "number" ? count : 0;
  }
}

export enum AllowVersionQuotationType {
  TRANSPORTATION = "TRANSPORTATION",
  ACTIVITY = "ACTIVITY",
  ACCOMMODATION = "ACCOMMODATION",
  FOOD = "FOOD",
  GUIDE = "GUIDE",
}

export { version_quotation_status as VersionQuotationStatusEnum };
