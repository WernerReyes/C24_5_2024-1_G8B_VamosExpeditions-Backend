import { createServer } from "http";
import { EnvsConst } from "./core/constants";
import { SocketService } from "./lib";
import { AppCache } from "./presentation/cache";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { AppSocket } from "./presentation/socket";
import "module-alias/register";


(async () => {
  await main();
})();

async function main() {
  try {
    const cache = new AppCache();
    await cache.initialize();
    await cache.externalCountries();
  } catch (error) {
    console.error("Error initializing cache:", error);
  }

  const server = new Server({
    routes: AppRoutes.routes,
    client_url: EnvsConst.CLIENT_URL,
  });

  const httpServer = createServer(server.app);

  const socketService = new SocketService(httpServer, new AppSocket());
  socketService.initEvents();

  httpServer.listen(EnvsConst.PORT, () => {
    console.log(`Server listening on port ${EnvsConst.PORT}`);
  });

  // server.start();
}
