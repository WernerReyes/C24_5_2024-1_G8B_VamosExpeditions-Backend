import type { Request, Response } from "express";
import { AppController } from "../controller";
import { UserService } from "./user.service";

export class UserController extends AppController {
  constructor(private readonly userService: UserService) {
    super();
  }

  public getUsers = async (req: Request, res: Response) => {
    this.handleError(this.userService.getUsers())
      .then((users) => res.status(200).json(users))
      .catch((error) => this.handleResponseError(res, error));
  };
}
