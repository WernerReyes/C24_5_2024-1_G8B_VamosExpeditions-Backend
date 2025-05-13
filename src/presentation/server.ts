import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import path from "path";

interface Options {
  origins: string[];
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private readonly publicPath: string;
  private readonly origins: string[];
  private readonly routes: Router;

  constructor(options: Options) {
    const { routes, public_path = "public", origins } = options;

    this.publicPath = public_path;
    this.routes = routes;
    this.origins = origins;

    this.configure();
  }
  //* Middlewares
  async configure() {
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: this.origins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Time-Zone", "Browser-Name"],
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
