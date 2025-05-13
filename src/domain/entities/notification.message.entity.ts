import type {
  INotificationModel
} from "@/infrastructure/models";
import { UserEntity } from "./user.entity";

export class NotificationMessageEntity {
  private constructor(
    public readonly id: number,
    public readonly from_user: number,
    public readonly to_user: number,
    public readonly message: string,
    public readonly is_read: boolean,
    public readonly created_at: Date,
    public readonly user?: UserEntity
  ) {}

  public static async fromObject(notification: {
    [key: string]: any;
  }): Promise<NotificationMessageEntity> {
    const {
      id,
      from_user,
      to_user,
      is_read,
      message,
      created_at,
      user_notification_from_userTouser,
    } = notification as INotificationModel;

    return new NotificationMessageEntity(
      id,
      from_user,
      to_user,
      message,
      is_read ?? false,
      created_at as Date,
      user_notification_from_userTouser
        ? await UserEntity.fromObject(user_notification_from_userTouser)
        : undefined
    );
  }
}
