import { EnvsConst } from "./core/constants";
import {
  ClienModel,
  CountryModel,
  CytyModel,
  DistritModel,
  ReservationDetailModel,
  ReservationModel,
  UserModel,
} from "./data/postgres";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  const server = new Server({
    port: EnvsConst.PORT,
    routes: AppRoutes.routes,
    client_url: EnvsConst.CLIENT_URL,
  });

  /*   const data1 = await CountryModel.findMany({
    select: {
      id_country: true,
      name: true,
      code: true,
      city: {
        select: {
          id_city: true,
          name: true,
          
        },
      },
    },
  }); */

  /* const data1 = await CountryModel.findMany({}); */

  /* const data1 = await CytyModel.findMany({
    select: {
      id_city: true,
      name: true,
      country:true
    },
  });

  console.dir(data1, { depth: null }); */


  
  // Itera sobre el array data1

 /*  const data2 = await ReservationModel.findMany({
    include: {
      reservation_has_city: {
        include: {
          city:{

            select:{
              id_city:true,
              name:true,
              country:true
            }
          
              
          
          },
          
        },
        
      },
      client: true,
    },
  });
  console.dir(data2,{depth: null});
   */

  server.start();
}
