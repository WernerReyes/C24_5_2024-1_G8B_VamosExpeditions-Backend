import { Request, Response } from "express";
import { AppController } from "../controller";
import { SettingService } from "./setting.service";

export class SettingController extends AppController {
  constructor(private readonly settingService: SettingService) {
    super();
  }

  public getAll = (req: Request, res: Response) => {
    return this.handleError(this.settingService.getAll())
      .then((setting) => res.status(200).json(setting))
      .catch((error) => this.handleResponseError(res, error));
  };
}
