import { Response } from "express";
import { CustomError } from "@/domain/error";
import { EnvsConst } from "@/core/constants";

export class AppController {
  constructor() {}

  protected handleError = async <T>(fn: Promise<T>) => {
    try {
      return await fn;
    } catch (error) {
      EnvsConst.NODE_ENV === "development" && console.error(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer(`${error}`);
    }
  };

  protected handleResponseError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error });
  };
}
