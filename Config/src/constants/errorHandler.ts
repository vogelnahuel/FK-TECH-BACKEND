import { EnumDictionary } from "../utils/enumDictionary";
import { Http } from "../utils/http";

enum ERROR {
  NotFound = "NotFound",
  InvalidParams = "InvalidParams",
}
/**
 *  @brief funcion que ejecuta el error correspondiente
 *  @params error y respuesta
 */
export const HTTP_ERROR_HANDLER = ({ error, res }): void => {
  const ERROR_SELECTOR: EnumDictionary<ERROR, Function> = {
    [ERROR.NotFound]: () => Http.NoContent(error.message, res),
    [ERROR.InvalidParams]: () => Http.BadRequest(error.message, res),
  };
  ERROR_SELECTOR[error.constructor.name]();
};
