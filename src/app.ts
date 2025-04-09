import { createServer } from "http";
import { EnvsConst } from "./core/constants";
import { SocketService } from "./lib";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
<<<<<<< HEAD
/* import "module-alias/register"; */
/* import * as XLSX from 'xlsx'; */
=======
import { AppSocket } from "./presentation/socket";
import { AppCacheContext } from "./presentation/context";
>>>>>>> 14b9a70b84eed112bf5e228a1a446dec79a53c7c

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
    console.error("Error initializing cache:", error);
  }

  const server = new Server({
    routes: AppRoutes.routes,
    origins: ORIGINS,
  });

<<<<<<< HEAD
  server.start();
  // data(req, res); // Removed as req and res are not defined in this context
  
   
  
 
}
=======
  const httpServer = createServer(server.app);

  const socketService = new SocketService(httpServer, new AppSocket(), ORIGINS);
  socketService.initEvents();
>>>>>>> 14b9a70b84eed112bf5e228a1a446dec79a53c7c

  httpServer.listen(EnvsConst.PORT, () => {
    console.log(`Server listening on port ${EnvsConst.PORT}`);
  });

  // server.start();
}


