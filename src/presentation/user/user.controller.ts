import type { Request, Response } from "express";
import { AppController } from "../controller";
import { UserService } from "./user.service";
import { UserDto } from "@/domain/dtos";
import { CustomError } from "@/domain/error";

export class UserController extends AppController {
  constructor(private readonly userService: UserService) {
    super();
  }

  public getUsers = async (req: Request, res: Response) => {
    this.handleError(this.userService.getUsers())
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
}
