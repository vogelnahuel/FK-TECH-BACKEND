import { LoginRequest } from "./loginRequest";
import { DatabaseUsers, LoginResponseData } from "./loginInterface";
import { generateToken } from "../../utils/token/token";
import { UserDao } from "../../dao/user/userDao";
import { InvalidParams, NotFound } from "../../utils/errorsClass";

/**
 *  LoginService
 *  @brief esta clase hace toda la logica de negocio de los endpoint de login
 *
 */
export class LoginService {
  /**
   *  LoginPostService
   *  @brief valida si el documento existe y su constraseña coinciden  tambien almacena el jwt en la base
   *  @param data documento y contraseña
   *  @returns  un obj  con el token o un error
   */
  public static async LoginPostService(
    data: LoginRequest
  ): Promise<LoginResponseData> {
    const { document, password } = data;
    //busca ese documento en la base
    const res: DatabaseUsers = await UserDao.findByDocument(document);
    //si no encontro ese documento
    if (!res) throw new NotFound("The document or password is invalid"); 

    //si no es la ultima contraseña
    if (password !== res.user.password[res.user.password.length - 1])
      throw new InvalidParams("The document or password is invalid");

    //generar token
    const access_token: string = generateToken(document);

    //almacenarlo en la base
    await UserDao.updateToken(access_token, document);

    //generar respuesta
    const dataResponse: LoginResponseData = {
      stores:res.stores,
      country:res.country,
      firstName: res.user.first_name,
      initialPass:
        res.user.system_pass === 1 && res.user.password.length === 1,
      lastAccessTs: res.user.last_access_ts,
      lastName: res.user.last_name,
      loginRetries: res.user.retries,
      nickName: res.document,
      passwordExpiredDate: res.user.expirate,
      passwordWhitening:
        res.user.system_pass === 1 && res.user.password.length > 1,
      role: {},
      savedQuestions: !!res.security_questions.answer ,
      token: access_token,
      userId: res.user.user_id,
      userName: res.user.user_name,
    };
    return dataResponse;
  }
}
