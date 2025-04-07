import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import path from "path";

interface Options {
  client_url: string;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private readonly publicPath: string;
  private readonly clientUrl: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { routes, public_path = "public", client_url } = options;

    this.publicPath = public_path;
    this.routes = routes;
    this.clientUrl = client_url;

    this.configure();
  }
  //* Middlewares
  async configure() {
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: [
          this.clientUrl,
          "https://c24-5-2024-1-g8b-vamosexpeditions-backend.onrender.com",
          "http://localhost:8000",
          "https://vamosexpeditions.netlify.app",
          "http://192.168.100.130:5173",
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
  }
}
