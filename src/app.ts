import { createServer } from "http";
import { EnvsConst } from "./core/constants";
import { SocketService } from "./lib";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { AppSocket } from "./presentation/socket";
import { AppCacheContext } from "./presentation/context";

const ORIGINS = [
  EnvsConst.CLIENT_URL,
  "https://c24-5-2024-1-g8b-vamosexpeditions-backend.onrender.com",
  "http://localhost:8000",
  "https://vamosexpeditions.netlify.app",
  "http://192.168.100.130:5173",
];

(async () => {
  await main();
})();

async function main() {
  try {
    await AppCacheContext.initialize();
  } catch (error) {
    console.error(error);
  }

  const server = new Server({
    routes: AppRoutes.routes,
    origins: ORIGINS,
  });

  const httpServer = createServer(server.app);

  const socketService = new SocketService(httpServer, new AppSocket(), ORIGINS);
  socketService.initEvents();

  httpServer.listen(EnvsConst.PORT, () => {
    console.log(`Server listening on port ${EnvsConst.PORT}`);
  });
}