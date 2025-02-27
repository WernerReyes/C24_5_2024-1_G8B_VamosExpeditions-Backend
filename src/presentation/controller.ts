import { Response } from "express"
import { CustomError } from "@/domain/error"



export class AppController {
  constructor() {}
  
  protected handleError = (res: Response, error:unknown) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error })
  }

}