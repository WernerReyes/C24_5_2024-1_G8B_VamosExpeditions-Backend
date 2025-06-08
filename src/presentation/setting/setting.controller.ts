import { CustomError } from "@/domain/error";
import type { Response } from "express";
import { UpdateSettingDto } from "@/domain/dtos";
import { AppController } from "../controller";
import { RequestAuth } from "../middleware";
import { SettingService } from "./setting.service";
import { Validations } from "@/core/utils";
import { SettingKeyEnum } from "@/infrastructure/models";

export class SettingController extends AppController {
  constructor(private readonly settingService: SettingService) {
    super();
  }

  public getAll = (req: RequestAuth, res: Response) => {
    return this.handleError(this.settingService.getAll(req.user.id))
      .then((setting) => res.status(200).json(setting))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getByKey = (req: RequestAuth, res: Response) => {
    const { key } = req.params;
    const error = Validations.validateEnumValue(
      key,
      Object.values(SettingKeyEnum)
    );
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    return this.handleError(this.settingService.getByKey(key as SettingKeyEnum))
      .then((setting) => res.status(200).json(setting))
      .catch((error) => this.handleResponseError(res, error));
  };

  public updateTwoFactorAuth = (req: RequestAuth, res: Response) => {
    const [error, updateSettingDto] = UpdateSettingDto.create({
      ...req.body,
      userId: req.user.id,
    });
    if (error) {
      return this.handleResponseError(res, CustomError.badRequest(error));
    }

    return this.handleError(
      this.settingService.updateTwoFactorAuth(updateSettingDto!)
    )
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
