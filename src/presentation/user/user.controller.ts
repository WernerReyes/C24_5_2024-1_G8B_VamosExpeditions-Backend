import type { Request, Response } from "express";
import { AppController } from "../controller";
import { UserService } from "./user.service";
import {
  ChangePasswordDto,
  GetUsersDto,
  TrashDto,
  UserDto,
} from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class UserController extends AppController {
  constructor(private readonly userService: UserService) {
    super();
  }

  public getUsers = async (req: Request, res: Response) => {
    const [error, getUsersDto] = GetUsersDto.create({
      ...req.query,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.userService.getUsers(getUsersDto!))
      .then((users) => res.status(200).json(users))
      .catch((error) => this.handleResponseError(res, error));
  };

  public upsertUser = async (req: Request, res: Response) => {
    const [error, userDto] = UserDto.create({
      ...req.body,
      id: req.params.id,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.userService.upsertUser(userDto!))
      .then((user) => res.status(200).json(user))
      .catch((error) => this.handleResponseError(res, error));
  };

  public trashUser = async (req: Request, res: Response) => {
    const [error, trashDto] = TrashDto.create({
      ...req.body,
      id: req.params.id,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));
    this.handleError(this.userService.trashUser(trashDto!))
      .then((user) => res.status(200).json(user))
      .catch((error) => this.handleResponseError(res, error));
  };

  public restoreUser = async (req: Request, res: Response) => {
    this.handleError(this.userService.restoreUser(+req.params.id))
     .then((user) => res.status(200).json(user))
     .catch((error) => this.handleResponseError(res, error));
  };

  public changePassword = async (req: Request, res: Response) => {
    const [error, changePasswordDto] = ChangePasswordDto.create({
      ...req.body,
      id: req.params.id,
    });
    if (error)
      return this.handleResponseError(res, CustomError.badRequest(error));

    this.handleError(this.userService.changePassword(changePasswordDto!))
      .then((user) => res.status(200).json(user))
      .catch((error) => this.handleResponseError(res, error));
  };
}
