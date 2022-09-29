import { QueryResult } from "pg";
import { expirationToken } from "../../utils/token/token";
import { DatabaseUsers } from "../../modules/login/loginInterface";
import DB from "../../modules/database/database";
import { NotFound } from "../../utils/errorsClass";

/**
 *  UserDao
 *  @brief hace peticiones a la base de users
 */
export class UserDao {
  /**
   *
   *  @brief busca si el document pasado por el usuario coincide con alguno almacenado en la base
   *  @param document
   *  @returns retorna el objeto de la fila de la tabla users
   */
  static async findByDocument(document: string): Promise<DatabaseUsers> {
    const sql: string = `SELECT * FROM users WHERE document = '${document}'  `;
    const result: boolean | QueryResult<any>[] = await DB.executeQuery(
      undefined,
      sql
    );
    const cast = result as QueryResult<any>[];
    if (cast[0].rowCount <= 0) return null;
    return result[0].rows[0];
  }
  /**
   *
   *  @brief almacena el token en la base
   *  @params  token y document
   *
   */
  static async updateToken(token: string, document: string): Promise<void> {
    // genero la fecha de expiracion del token
    const expiration: string = expirationToken();
    const sql: string = `UPDATE users 
      SET sessions = sessions  || '{"token": "${token}","expiration":"${expiration}"}'
        WHERE document ='${document}' `;

    const result = await DB.executeQuery(undefined, sql);
    const cast = result as QueryResult<any>[];
    if (cast[0].rowCount <= 0) throw new NotFound("Could not update jwt");
  }
}
