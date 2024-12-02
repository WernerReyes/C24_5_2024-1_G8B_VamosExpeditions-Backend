import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import path from "path";

interface Options {
  port: number;
  client_url: string;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly clientUrl: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = "public", client_url } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
    this.clientUrl = client_url;
  }

  async start() {
    //* Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: this.clientUrl,
        credentials: true,
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

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
