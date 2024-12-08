import { EnvsConst } from "./core/constants";
import { ClienModel, UserModel } from "./data/postgres";
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
   
  
  server.start();
}
