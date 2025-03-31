import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import path from "path";
import http from "http";

import { Server as SocketServer } from "socket.io";

import { SocketService } from "@/lib";
import { NotificationService } from "./notification/notification.service";
interface Options {
  port: number;
  client_url: string;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();

  private readonly port: number;
  private readonly publicPath: string;
  private readonly clientUrl: string;
  private readonly routes: Router;

  private readonly httpServer: http.Server;
  private io: SocketServer;

  constructor(options: Options) {
    const { port, routes, public_path = "public", client_url } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
    this.clientUrl = client_url;
    this.httpServer = http.createServer(this.app);
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: client_url,
        credentials: true,
      },
      /* pingInterval: 25000,
      pingTimeout: 20000, */
    });
    this.configurarSockets();
  }

  async start() {
    //* Middlewares

    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: [
          this.clientUrl,
          "https://c24-5-2024-1-g8b-vamosexpeditions-backend.onrender.com",
          "http://localhost:8000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // ✅ Asegura que POST está permitido
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.routes);

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get("*", (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
    });

    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.httpServer?.close();
  }

  configurarSockets() {
    const notificationService = new NotificationService();
    new SocketService(this.io, notificationService);
  }
}
