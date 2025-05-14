import {
  Prisma,
  type reservation_status,
  type reservation_version_summary,
} from "@prisma/client";
import { Model, prisma } from "../model";
import { Decimal } from "@prisma/client/runtime/library";

export interface IReservationVersionSummaryView
  extends reservation_version_summary {}

export class ReservationVersionSummaryView
  extends Model<IReservationVersionSummaryView>
  implements IReservationVersionSummaryView
{
  public static reservation_version_summary =
    prisma.reservation_version_summary;

  private static _instance: ReservationVersionSummaryView;

  protected override get getEmpty(): ReservationVersionSummaryView {
    return ReservationVersionSummaryView._instance;
  }

  constructor(
    public readonly version_number: number | null,
    public readonly quotation_id: number | null,
    public readonly profit_margin: Decimal | null,
    public readonly final_price: Decimal | null,
    public readonly id: number,
    public readonly reservation_date: Date | null,
    public readonly reservation_status: reservation_status
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new ReservationVersionSummaryView(
      null,
      null,
      null,
      null,
      0,
      new Date(0),
      "" as reservation_status
    );
  }

  public static get instance(): ReservationVersionSummaryView {
    return this._instance;
  }

  public static get getString() {
    return this._instance.getString();
  }

  public static async groupBy<
    T extends Prisma.reservation_version_summaryGroupByArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.reservation_version_summaryGroupByArgs>
  ): Promise<Prisma.GetReservation_version_summaryGroupByPayload<T>> {
    return await this.reservation_version_summary.groupBy(args as any);
  }

  public static async aggregate<
    T extends Prisma.Reservation_version_summaryAggregateArgs
  >(
    args: Prisma.SelectSubset<
      T,
      Prisma.Reservation_version_summaryAggregateArgs
    >
  ): Promise<Prisma.GetReservation_version_summaryAggregateType<T>> {
    return await this.reservation_version_summary.aggregate(args);
  }
}
