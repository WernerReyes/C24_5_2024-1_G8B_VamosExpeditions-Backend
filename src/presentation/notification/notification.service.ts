import { NotificationModel, UserModel } from "@/data/postgres";
import { NotificationMessageEntity, UserEntity } from "@/domain/entities";

interface NotificationMessage {
  to_user: number[];
  from_user: number;
  message: string;
}

export class NotificationService {
  public async getAllUserConected(userId: number) {
    try {
      const users = await UserModel.findMany({
        include: {
          role: true,
        },
        omit: {
          password: true,
          id_role: true,
        },
        where: {
          id_user: { not: userId },
         
        },
        orderBy: {
          online: "desc",
        },
      });

     
      return users.map((user) => UserEntity.fromObject(user));
     
      
    } catch (error) {
      console.error(error);
    }
  }

  private async updateUserStatus(
    userId: number,
    online: boolean
  ): Promise<UserEntity> {
    if (!userId) throw new Error("El ID del usuario no puede ser nulo.");

    try {
      const user = await UserModel.update({
        where: { id_user: userId },
        data: { online },
        omit: { id_role: true, password: true },
        include: { role: true },
      });

      return UserEntity.fromObject(user);
    } catch (error) {
      throw new Error(`Error actualizando estado del usuario: ${error}`);
    }
  }

  public connectUserSocket(userId: number): Promise<UserEntity> {
    return this.updateUserStatus(userId, true);
  }

  public disconnectUserSocket(userId: number): Promise<UserEntity> {
    return this.updateUserStatus(userId, false);
  }

  public async getUserNotifications(userId: number) {
    const MessageUser = await NotificationModel.findMany({
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

    return MessageUser.map((message) =>
      NotificationMessageEntity.fromObject(message)
    );
  }

  public async deleteNotifications(notificationIds: number[]) {
    try {
      if (!notificationIds || notificationIds.length === 0) {
        return {
          message: `No se ha seleccionado ninguna notificación para eliminar`,
        };
      }

      const data = await NotificationModel.deleteMany({
        where: { id: { in: notificationIds } },
      });
      console.log(data);

      return {
        message: `Notificaciones eliminadas correctamente`,
      };
    } catch (error) {
      console.error(error);
    }
  }

  public async markNotificationsAsRead(notificationIds: number[]) {
    console.log(notificationIds);
    try {
      if (!notificationIds || notificationIds.length === 0) {
        return {
          message: `No se ha seleccionado ninguna notificación para marcar como leída`,
        };
      }

      await NotificationModel.updateMany({
        where: { id: { in: notificationIds } },
        data: { is_read: true },
      });

      return {
        message: `Notificaciones marcadas como leídas correctamente`,
      };
    } catch (error) {
      console.error(error);
    }
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
      return notificationUsers.map((notification) => NotificationMessageEntity.fromObject(notification));
    } catch (e) {
      console.log(e);
    }
  }



}
