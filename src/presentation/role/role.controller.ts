import type { Request, Response } from "express";
import { AppController } from "../controller";
import { RoleService } from "./role.service";
import { GetRolesDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class RoleController extends AppController {
  constructor(private readonly roleService: RoleService) {
    super();
  }

  public getAll = async (req: Request, res: Response) => {
    const [error, getRolesDto] = GetRolesDto.create(req.query);
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.roleService.getAll(getRolesDto!))
      .then((roles) => res.status(200).json(roles))
      .catch((error) => this.handleResponseError(res, error));
  };
}
