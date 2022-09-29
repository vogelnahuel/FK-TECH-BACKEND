import { LoginService } from "./loginServices";
import { Request, Response } from "express";
import { Http } from "../../utils/http";
import { HTTP_ERROR_HANDLER } from "../../constants/errorHandler";

/**
 *  LoginController
 *  @brief Controllador de las pantallas de login
 *
 */
export class LoginController {

  /**
   * @brief  controla la ruta de login
   * @param req  recibe en el body el documento y contraseña
   * @returns  un obj  con el token o un error
   */
  public static async LoginPost(req: Request, res: Response) {
    try {
      const response = await LoginService.LoginPostService(req.body);
      Http.Ok(response, res);
    } catch (error) {
      HTTP_ERROR_HANDLER({ error, res });
    }
  }
}
