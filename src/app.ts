import { Envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: Envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}
