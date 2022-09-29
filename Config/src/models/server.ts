import Login from "../routes/login/login";
import express, { Request, Response } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../constants/swaggerConfig";
import { verifyToken } from "../utils/token/token";
import { UrlConstants } from "../constants/urlConstants";
import { Express } from "express-serve-static-core";

/**
 * Server
 * @brief inicializa el servidor
 *
 */
export default class Server {
  public readonly app: Express;
  private readonly port: string;
  private readonly loginPath: string;
  /**
   * @brief inicializa las rutas y middlewares
   */

  constructor() {
    this.app = express();

    this.port = process.env.PORT || "3000";
    this.loginPath = `${UrlConstants.URL_ENDPOINT_LOGIN}`;
    //Middlewares
    this.middlewares();

    //Rutas de mi app
    this.routes();
  }
  /**
   * @brief inicializa los  middlewares
   *
   */
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    //parseo y lectura del body de lo que mande el front en cualquier verbo http
    this.app.use(express.json());
    this.app.use(verifyToken);
    this.app.disable("x-powered-by");
  }
  /**
   * @brief inicializa los  rutas
   *
   */
  routes() {
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJsDoc(swaggerOptions))
    );
    this.app.use(this.loginPath, Login);
    //ruta por defecto en caso de no encontrarse
    this.app.all("*", (req: Request, res: Response) => {    
      res.status(404).json({
        error: -2,
        descripcion: `ruta ${req.url} y  método  ${req.method} no implementados`,
      });
    });
  }
  /**
   * @brief metodo que inicia  el servidor
   */
  listen() {
    return this.app.listen(this.port,() =>{
      console.log('Server listening at port %s', this.port);
    });
  }

}

