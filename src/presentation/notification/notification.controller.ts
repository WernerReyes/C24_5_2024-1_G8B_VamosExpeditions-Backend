import { AppController } from "../controller";
import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

import type { RequestAuth } from "../middleware";

export class NotificationController extends AppController {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  

  public listUserNotifications = async (req: RequestAuth, res: Response) => {
    this.handleError(this.notificationService.getUserNotifications(req.user.id))
      .then((notifications) => res.status(200).json(notifications))
      .catch((error) => this.handleResponseError(res, error));


  }; 

  public deleteNotifications= async ( req:Request,res:Response)=>{

    
    this.handleError(this.notificationService.deleteNotifications(req.body.ids))
      .then((notifications) => res.status(200).json(notifications))
      .catch((error) => this.handleResponseError(res, error));
  }


  public markNotificationsAsRead= async ( req:Request,res:Response)=>{
    this.handleError(this.notificationService.markNotificationsAsRead(req.body.ids))
      .then((notifications) => res.status(200).json(notifications))
      .catch((error) => this.handleResponseError(res, error));
  }
}
