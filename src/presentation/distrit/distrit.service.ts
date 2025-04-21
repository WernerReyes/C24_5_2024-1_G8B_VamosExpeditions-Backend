import { CityModel, CountryModel, DistritModel } from "@/data/postgres";
import { ApiResponse } from "../response";
import { DistritEntity } from "@/domain/entities";


export class DistritService {
  constructor() {}



  


  public async getAllDistrit() {
    const distrits = await DistritModel.findMany({
      omit: {
        city_id: true,
      },
      include: {
          city: true,
        },
        orderBy: {
          city: {
            name: "asc",
          },
      },
      
      
    });
    
    /* const city= await CityModel.findMany({
        include: {
            distrit: true,
        },
    })
    return{
        city,
    } */
    return new ApiResponse<DistritEntity[]>(
      200,
      "Lista de distritos",
      await Promise.all(
        distrits.map((distrit) => DistritEntity.fromObject(distrit))
      )
    );
}
}
