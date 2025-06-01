import { CustomError } from "@/domain/error";
import type { Response } from "express";
import { UpdateSettingDto } from "@/domain/dtos";
import { AppController } from "../controller";
import { RequestAuth } from "../middleware";
import { SettingService } from "./setting.service";

export class SettingController extends AppController {
  constructor(private readonly settingService: SettingService) {
    super();
  }

  public getAll = (req: RequestAuth, res: Response) => {
    return this.handleError(this.settingService.getAll(req.user.id))
      .then((setting) => res.status(200).json(setting))
      .catch((error) => this.handleResponseError(res, error));
  };

  public updateDynamicCleanup = (req: RequestAuth, res: Response) => {
    const [error, updateSettingDto] = UpdateSettingDto.create({
      ...req.body,
      userId: req.user.id,
    });
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    return this.handleError(
      this.settingService.updateDynamicCleanup(updateSettingDto!)
    )
      .then((setting) => res.status(200).json(setting))
      .catch((error) => this.handleResponseError(res, error));
  };

  public updateMaxActiveSessions = (req: RequestAuth, res: Response) => {
    const [error, updateSettingDto] = UpdateSettingDto.create({
      ...req.body,
      userId: req.user.id,
    });
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    return this.handleError(
      this.settingService.updateMaxActiveSessions(updateSettingDto!)
    )
      .then((setting) => res.status(200).json(setting))
      .catch((error) => this.handleResponseError(res, error));
  };
}
