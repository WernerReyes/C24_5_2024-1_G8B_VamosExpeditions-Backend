import { NotificationModel } from "@/data/postgres";
import { NotificationMessageEntity } from "@/domain/entities";
import { ApiResponse } from "../response";

interface NotificationMessage {
  to_user: number[];
  from_user: number;
  message: string;
}

export class NotificationService {
  private static instance: NotificationService;

  constructor() {
    NotificationService.instance = this;
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      throw new Error(
        "NotificationService not initialized. Call initialize() first."
      );
    }
    return NotificationService.instance;
  }

  public async getUserNotifications(userId: number) {
    const messageUser = await NotificationModel.findMany({
      include: {
        user_notification_from_userTouser: {
          omit: {
            password: true,
            id_role: true,
          },
        },
      },
      where: { to_user: userId },
      orderBy: { created_at: "desc" },
      omit: {
        updated_at: true,
      },
    });

    return await Promise.all(
      messageUser.map((message) =>
        NotificationMessageEntity.fromObject(message)
      )
    );
  }

  public async deleteNotifications(notificationIds: number[]) {
    if (!notificationIds || notificationIds.length === 0) {
      return {
        message: `No se ha seleccionado ninguna notificación para eliminar`,
      };
    }

    await NotificationModel.deleteMany({
      where: { id: { in: notificationIds } },
    });

    return new ApiResponse<number[]>(
      200,
      `Notificaciones eliminadas correctamente`,
      notificationIds
    );
  }

  public async markNotificationsAsRead(notificationIds: number[]) {
    if (!notificationIds || notificationIds.length === 0) {
      return {
        message: `No se ha seleccionado ninguna notificación para marcar como leída`,
      };
    }

    const notificationsUpdated = await NotificationModel.updateManyAndReturn({
      where: { id: { in: notificationIds } },
      data: { is_read: true },
    });

    return new ApiResponse<NotificationMessageEntity[]>(
      200,
      `Notificaciones marcadas como leídas correctamente`,
      await Promise.all(
        notificationsUpdated.map((notification) =>
          NotificationMessageEntity.fromObject(notification)
        )
      )
    );
  }

  public async NotificationMessage(notifications: NotificationMessage) {
    try {
      const resultMessage = notifications.to_user.map((toUser) => ({
        ...notifications,
        to_user: toUser,
      }));

      const notificationUsers = await NotificationModel.createManyAndReturn({
        data: resultMessage,
        omit: {
          updated_at: true,
        },
        include: {
          user_notification_from_userTouser: {
            omit: {
              password: true,
              id_role: true,
            },
          },
        },
      });
      return await Promise.all(
        notificationUsers.map((notification) =>
          NotificationMessageEntity.fromObject(notification)
        )
      );
    } catch (e) {
      console.log(e);
    }
  }
}
