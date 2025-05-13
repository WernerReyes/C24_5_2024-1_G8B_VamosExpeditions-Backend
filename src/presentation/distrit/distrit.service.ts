
import { DistrictModel } from "@/infrastructure/models";
import { ApiResponse } from "../response";
import { DistritEntity } from "@/domain/entities";


export class DistritService {
  constructor() {}

  public async getAllDistrit() {
    const distrits = await DistrictModel.findMany({
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
    
    return new ApiResponse<DistritEntity[]>(
      200,
      "Lista de distritos",
      await Promise.all(
        distrits.map((distrit) => DistritEntity.fromObject(distrit))
      )
    );
}
}
