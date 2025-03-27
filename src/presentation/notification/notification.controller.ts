import { AppController } from "../controller";
import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { JwtAdapter } from "@/core/adapters";
import type { RequestAuth } from "../middleware";

export class NotificationController extends AppController {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  public getAllUserConected = async (req: Request, res: Response) => {
     
    const userId = (req as RequestAuth).user.id;
  
    this.handleError(this.notificationService.getAllUserConected(userId))
      .then((users) => res.status(200).json(users))
      .catch((error) => this.handleResponseError(res, error));
  };

  public listUserNotifications = async (req: RequestAuth, res: Response) => {
    /* const  cookieToken = req.cookies?.token; 
    const payload = await JwtAdapter.verifyToken<{ id: string }>(cookieToken); */  
    
    

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
