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

  private static _instance: NotificationModel

  protected override get getEmpty(): NotificationModel {
    return NotificationModel._instance;
  }
  constructor(
    public readonly id: number,
    public readonly from_user: number,
    public readonly to_user: number,
    public readonly message: string,
    public readonly is_read: boolean | null,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public user_notification_from_userTouser?: IUserModel
  ) {
    super();
  }

  public static initialize(): void {
    this._instance = new NotificationModel(
      0,
      0,
      0,
      "",
      null,
      new Date(0),
      new Date(0)
    );
  }



  public static get instance(): NotificationModel {
    return this._instance;
  }

  public static get partialInstance(): NotificationModel {
    return new NotificationModel(
      this._instance.id,
      this._instance.from_user,
      this._instance.to_user,
      this._instance.message,
      this._instance.is_read,
      this._instance.created_at,
      this._instance.updated_at
    );
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
