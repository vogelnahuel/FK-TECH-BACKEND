import { QueryResult, QueryResultBase } from "pg";
import DB from "../../modules/database/database";
import { DatabaseUsers } from "../../modules/login/loginInterface";
import { UserDao } from "./userDao";
import { DatabaseUser } from "../../constants/loginDatabase";

describe("UsersDao", () => {
  /**
   *
   *  @brief   llama a la clase que ejecuta las consultas y las mockea
   *  @assert  valida si el resultado que devuelve la consulta tiene rows
   */
  test("Login userDao findByDocument Positive", async () => {
    const QueryResultBase: QueryResultBase = {
      command: "",
      rowCount: 1,
      oid: 0,
      fields: [],
    };
    const QueryResult: QueryResult<any>[] = [{ ...QueryResultBase, rows: [DatabaseUser] }];
    const DatabaseQuery = jest
      .spyOn(DB, "executeQuery")
      .mockResolvedValue(QueryResult);

    const resUser: DatabaseUsers = await UserDao.findByDocument("12345678");
    expect(DatabaseQuery).toHaveBeenCalled();
    expect(resUser).toHaveProperty("document");
    DatabaseQuery.mockClear();
  });
  /**
   *
   *  @brief   llama a la clase que ejecuta las consultas y las mockea no devuelve nada
   *  @assert  valida si el resultado que devuelve la consulta no tiene rows
   */
  test("Login userDao findByDocument Negative", async () => {
    const QueryResultBase: QueryResultBase = {
      command: "",
      rowCount: 0,
      oid: 0,
      fields: [],
    };
    const QueryResult: QueryResult<any>[] = [{ ...QueryResultBase, rows: [] }];
    const DatabaseQuery = jest
      .spyOn(DB, "executeQuery")
      .mockResolvedValue(QueryResult);

    try {
      await UserDao.findByDocument("12345678");
    } catch (error) {
      expect("The document or password is invalid").toEqual(error.message);
    }

    expect(DatabaseQuery).toHaveBeenCalled();
    DatabaseQuery.mockClear();
  });

  /**
   *
   *  @brief   llama a la clase que ejecuta las consultas y las mockea
   *  @assert  valida si la funcion fue llamada correctamente y no devuelve error
   */
  test("Login userDao updateToken Positive", async () => {
    const QueryResultBase: QueryResultBase = {
      command: "",
      rowCount: 1,
      oid: 0,
      fields: [],
    };
    const QueryResult: QueryResult<any>[] = [{ ...QueryResultBase, rows: [DatabaseUser] }];
    const DatabaseQuery = jest.spyOn(DB, "executeQuery").mockResolvedValue(QueryResult);
    await UserDao.updateToken("", "");
    expect(DatabaseQuery).toHaveBeenCalled();
  });
  /**
   *
   *  @brief   llama a la clase que ejecuta las consultas y las mockea no existe documento
   *  @assert  valida si la funcion fue llamada y devuelve error
   */
  test("Login userDao updateToken Negative", async () => {
    const QueryResultBase: QueryResultBase = {
      command: "",
      rowCount: 0,
      oid: 0,
      fields: [],
    };

    const QueryResult: QueryResult<any>[] = [{ ...QueryResultBase, rows: [] }];
    const DatabaseQuery = jest.spyOn(DB, "executeQuery").mockResolvedValue(QueryResult);
    try {
      await UserDao.updateToken("", "");
    } catch (error) {
      expect("Could not update jwt").toEqual(error.message);
    }
    expect(DatabaseQuery).toHaveBeenCalled();
    DatabaseQuery.mockClear();
  });
});
