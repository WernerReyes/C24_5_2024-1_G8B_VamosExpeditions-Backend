import { Prisma, type notification } from "@prisma/client";
import { Model, prisma } from "./model";
import { type IUserModel } from "./user.model";

export interface INotificationModel extends notification {
  user_notification_from_userTouser?: IUserModel;
}

export class NotificationModel
  extends Model<INotificationModel>
  implements INotificationModel
{
  private static notification = prisma.notification;

  private static _instance: NotificationModel = new NotificationModel(
    0,
    0,
    0,
    "",
    false,
    new Date(),
    new Date()
  );

  protected override get getEmpty(): NotificationModel {
    return NotificationModel._instance;
  }
  constructor(
    public readonly id: number,
    public readonly from_user: number,
    public readonly to_user: number,
    public readonly message: string,
    public readonly is_read: boolean | null,
    public readonly created_at: Date | null,
    public readonly updated_at: Date | null,
    public user_notification_from_userTouser?: IUserModel
  ) {
    super();
  }

  public static get instance(): NotificationModel {
    return this._instance;
  }

  public static set setUserNotificationFromUser(user: IUserModel) {
    this._instance.user_notification_from_userTouser = user;
  }

  public static getString() {
    return this._instance.getString();
  }

  public static async findMany<T extends Prisma.notificationFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.notificationFindManyArgs>
  ): Promise<Prisma.notificationGetPayload<T>[]> {
    return await this.notification.findMany(args);
  }

  public static async createManyAndReturn<
    T extends Prisma.notificationCreateManyAndReturnArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.notificationCreateManyAndReturnArgs>
  ): Promise<Prisma.notificationGetPayload<T>[]> {
    return await this.notification.createManyAndReturn(args);
  }
  
  public static async updateManyAndReturn<
    T extends Prisma.notificationUpdateManyAndReturnArgs
  >(
    args: Prisma.SelectSubset<T, Prisma.notificationUpdateManyAndReturnArgs>
  ): Promise<Prisma.notificationGetPayload<T>[]> {
    return await this.notification.updateManyAndReturn(args);
  }

  public static async deleteMany<T extends Prisma.notificationDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.notificationDeleteManyArgs>
  ): Promise<Prisma.BatchPayload> {
    return await this.notification.deleteMany(args);
  }
}
