import { Prisma, type reservation, reservation_status } from "@prisma/client";
import { Model, prisma } from "./model";
import { type IQuotationModel } from "./quotation.model";

export interface IReservationModel extends reservation {
  quotation?: IQuotationModel;
}

export class ReservationModel
  extends Model<IReservationModel>
  implements IReservationModel
{
  public static reservation = prisma.reservation;

  private static _instance: ReservationModel = new ReservationModel(
    0,
    0,
    "" as reservation_status,
    new Date(0),
    new Date(0),
    false,
    null,
    null
  );

  protected override get getEmpty(): ReservationModel {
    return ReservationModel._instance;
  }

  constructor(
    public readonly id: number,
    public readonly quotation_id: number,
    public readonly status: reservation_status,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly is_deleted: boolean,
    public readonly deleted_at: Date | null,
    public readonly delete_reason: string | null,
    public quotation?: IQuotationModel
  ) {
    super();
  }

  public static get instance(): ReservationModel {
    return this._instance;
  }

  public static set quotation(quotation: IQuotationModel) {
    this._instance.quotation = quotation;
  }

  static get getString() {
    return this._instance.getString();
  }

  public static async findUnique<T extends Prisma.reservationFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.reservationFindUniqueArgs>
  ): Promise<Prisma.reservationGetPayload<T> | null> {
    return await this.reservation.findUnique(args);
  }

  public static async findMany<T extends Prisma.reservationFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.reservationFindManyArgs>
  ): Promise<Prisma.reservationGetPayload<T>[]> {
    return await this.reservation.findMany(args);
  }

  public static async create<T extends Prisma.reservationCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.reservationCreateArgs>
  ): Promise<Prisma.reservationGetPayload<T>> {
    return await this.reservation.create(args);
  }

  public static async update<T extends Prisma.reservationUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.reservationUpdateArgs>
  ): Promise<Prisma.reservationGetPayload<T>> {
    return await this.reservation.update(args);
  }

  public static async count<T extends Prisma.reservationCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.reservationCountArgs>
  ): Promise<number> {
    const count = await this.reservation.count(args);
    return typeof count === "number" ? count : 0;
  }
}

export { reservation_status as ReservationStatusEnum };

