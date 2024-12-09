import { EnvsConst } from "./core/constants";
import { ClienModel, CountryModel, CytyModel, DistritModel, ReservationDetailModel, ReservationModel, UserModel } from "./data/postgres";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

 async  function main() {
  const server = new Server({
    port: EnvsConst.PORT,
    routes: AppRoutes.routes,
    client_url: EnvsConst.CLIENT_URL,
  });
  

  const data = await ReservationModel.findMany();
  

  const data2 = await ReservationModel.findMany({
    include: {
      reservation_has_city: {
        include: {
          city: true,
        },
      },
      Client: true,
    },
  });
  console.dir(data2,{depth: null});



  server.start();
}
