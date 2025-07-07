import { Request, Response } from "express";
import { AppController } from "../controller";
import { CityService } from "./city.service";
import { CityDto } from "@/domain/dtos/city/city.dto";



export class CityController extends AppController {
  constructor(private cityService: CityService) {
    super();
  }

  public getCitiesAlls = (req: Request, res: Response) => {
    this.handleError(this.cityService.getCitiesAlls())
      .then((cities) => res.status(200).json(cities))
      .catch((error) => this.handleResponseError(res, error));
  };

  public getCityAndDistrit=(req:Request , res:Response)=>{
    this.handleError(this.cityService.getCityAndDistritAll())
    .then((cities)=> res.status(200).json(cities))
    .catch((error)=> this.handleResponseError(res,error));
  }


    public upsertCity = (req: Request, res: Response) => {
        const [error, city] = CityDto.create({
            ...req.body,
            cityId: req.params.id,
        });
        
        if (error) return this.handleResponseError(res, error);
        this.handleError(this.cityService.upsertCity(city!))
            .then((city) => res.status(200).json(city))
            .catch((error) => this.handleResponseError(res, error));
    }
}
