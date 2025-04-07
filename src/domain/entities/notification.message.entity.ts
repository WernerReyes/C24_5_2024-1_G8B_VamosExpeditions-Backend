import { Validations } from "@/core/utils";
import { CustomError } from "../error";
import type { user, notification } from "@prisma/client";
import { UserEntity } from "./user.entity";
interface NotificationMessage extends Omit<notification, "updated_at"> {
  user_notification_from_userTouser?: Omit<user, "password" | "id_role">;
}

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

  public static async fromObject(
    notification: NotificationMessage
  ): Promise<NotificationMessageEntity> {
    const {
      id,
      from_user,
      to_user,
      is_read,
      message,
      created_at,
      user_notification_from_userTouser,
    } = notification;
    const error = Validations.validateEmptyFields(
      {
        id,
        from_user,
        to_user,
        message,
        created_at,
      },
      "NotificationMessageEntity"
    );
    if (error) throw CustomError.badRequest(error);

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
