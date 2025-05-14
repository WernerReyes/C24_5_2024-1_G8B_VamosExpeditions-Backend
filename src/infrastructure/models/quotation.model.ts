import { Prisma, type quotation, } from "@prisma/client";
import { Model, prisma } from "./model";
import { type IReservationModel } from "./reservation.model";
import { type IVersionQuotationModel } from "./versionQuotation.model";

export interface IQuotationModel extends quotation {
  version_quotation?: IVersionQuotationModel[];
  reservation?: IReservationModel | null;
}
export class QuotationModel
  extends Model<IQuotationModel>
  implements IQuotationModel
{
  public static quotation = prisma.quotation;

  private static _instance: QuotationModel

  protected override get getEmpty(): QuotationModel {
    return QuotationModel._instance;
  }
  constructor(
    public readonly id_quotation: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public version_quotation?: IVersionQuotationModel[],
    public reservation?: IReservationModel | null
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new QuotationModel(0, new Date(0), new Date(0));
  }

  public static get instance(): QuotationModel {
    return this._instance;
  }

  public static get partialInstance(): QuotationModel {
    return new QuotationModel(
      this._instance.id_quotation,
      this._instance.created_at,
      this._instance.updated_at
    );
  }

  public static set setVersionQuotation(
    versionQuotation: IVersionQuotationModel[]
  ) {
    this._instance.version_quotation = versionQuotation;
  }

  public static set setReservation(reservation: IReservationModel | null) {
    this._instance.reservation = reservation;
  }

  public static getString() {
    return this._instance.getString();
  }

  public static async findUnique<T extends Prisma.quotationFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.quotationFindUniqueArgs>
  ): Promise<Prisma.quotationGetPayload<T> | null> {
    return await this.quotation.findUnique(args);
  }
}
