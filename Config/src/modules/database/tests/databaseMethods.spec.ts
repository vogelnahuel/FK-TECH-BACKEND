import DB from "../database";
import { Database } from "../database";
import { QueryResult, PoolClient, Pool } from "pg";
import { _TRANSACTION } from "../../../constants/database";
import * as config from "../config";
import fs from "fs";


jest.mock("pg", () => {
  const mClient = {
    connect: () => {
      return {
        release: jest.fn(),
        query: jest.fn(),
      };
    },
    query: jest.fn(),
    end: jest.fn(),
    release: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mClient) };
});

describe("test database methods", () => {
  beforeEach(() => {
    DB.Pool = new Pool();
    jest.restoreAllMocks();
    Database.Initialized = false;
    Database.Schema = false;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    DB.Pool = new Pool();
  });

  const mockedStart = jest.spyOn(DB, "start").mockResolvedValue(true);
  const query: string = "SELECT * FROM users";
  const queries: string[] = [
    "SELECT * FROM users",
    "SELECT * FROM sales",
    "SELECT * FROM events",
  ];
  const objQueryResult: QueryResult = {
    command: "",
    rowCount: 1,
    oid: 0,
    rows: [
      {
        document: "",
        country: "",
        store: "",
        users: {
          user_id: 0,
          stores: [],
          password: [],
          creation_ts: "",
          user_name: "admin",
        },
      },
    ],
    fields: [],
  };

  /**
   * @brief Verifica la conexión a la base de datos
   * @assert Comprueba que retorne true
   */
  it("test db connection start method", async () => {
    const connection: jest.SpyInstance = jest
      .spyOn(DB, "schema")
      .mockResolvedValue(true);
    const consoleCalled: jest.SpyInstance = jest.spyOn(console, "log");
    const init: boolean = await DB.start();
    expect(consoleCalled).toHaveBeenNthCalledWith(
      1,
      "db.js (start): server initialization"
    );
    expect(consoleCalled).toHaveBeenNthCalledWith(
      2,
      `db.js (start): server is running on postgresql://${config.dbUser}@${
        config.dbHost || "localhost"
      }:${config.dbPort || 5432}/${config.dbName}`
    );
    expect(connection).toHaveBeenCalled();
    expect(typeof init).toBe("boolean");
    expect(init).toBe(true);
  });

  /**
   * @brief Verifica si el eschema falla el metodo start debe ser false
   * @assert Comprueba que retorne false
   */
  it("test if schema is false in start method", async () => {
    const isSchemaCalled: jest.SpyInstance = jest
      .spyOn(DB, "schema")
      .mockResolvedValue(false);
    const start: boolean = await DB.start();
    expect(isSchemaCalled).toHaveBeenCalled();
    expect(start).toBe(false);
  });

  /**
   * @brief Verifica que falle la conexión
   * @assert Comprueba que el valor retornado sea false
   */
  it("test if schema fails", async () => {
    const init: jest.SpyInstance = jest
      .spyOn(DB.Pool, "connect")
      .mockReturnValue(undefined);
    const connection: boolean = await DB.schema();
    expect(typeof connection).toBe("boolean");
    expect(connection).toEqual(false);
  });

  /**
   * @brief Verifica que el schema lea el directorio de scripts
   * @assert Comprueba que fs.readdirSync se halla invocado
   */
  it("test if schema read scripts", async () => {
    const readDirScripts: jest.SpyInstance<fs.Dirent[]> = jest.spyOn(
      fs,
      "readdirSync"
    );
    await DB.schema();
    expect(readDirScripts).toHaveBeenCalled();
  });

  /**
   * @brief Verifica que se ejecute la conexión con el modulo inicializado
   * @assert Comprueba que retorne true
   */
  it("test connection if initialized is true", async () => {
    Database.Initialized = true;
    Database.Schema = false;
    const isSchemaCalled: jest.SpyInstance = jest.spyOn(DB, "schema");
    const start: boolean = await DB.start();
    expect(isSchemaCalled).toHaveBeenCalled();
    expect(start).toBe(true);
  });

  /**
   * @brief Verifica si initialzed es true y falla schema dentro de start
   * @assert Comprueba que retorne false
   */
  it("test in start method if initialized is true and schema returns false", async () => {
    Database.Initialized = true;
    Database.Schema = false;
    const isSchemaCalled: jest.SpyInstance = jest
      .spyOn(DB, "schema")
      .mockResolvedValue(false);
    const start: boolean = await DB.start();
    expect(isSchemaCalled).toHaveBeenCalled();
    expect(start).toBe(false);
  });

  /**
   * @brief Verifica que si no recibe un cliente retorne false
   * @assert Compara que el retorno sea false
   */
  it("test bulk method without a client", async () => {
    const bulk: QueryResult[] | boolean = await DB.bulk(undefined, queries);
    expect(bulk).toBe(false);
  });

  /**
   * @brief Verifica que se realice la ejecución del array de queries
   * @assert Verifica el tió de dato retornado y una propiedad en especifico
   */
  it("test bulk method", async () => {
    jest.spyOn(DB, "execute").mockResolvedValue(objQueryResult);
    const init: PoolClient = await DB.init();
    const bulk: QueryResult[] | boolean = await DB.bulk(init, queries);
    expect(typeof bulk).toBe("object");
    expect(bulk[0]).toHaveProperty("rowCount");
    expect(bulk[0].rowCount).toEqual(1);
  });

  /**
   * @brief Verifica que se realice la ejecución del array de queries
   * @assert Verifica si falla debe retornar false
   */
  it("test bulk method if execute method returns undefined", async () => {
    jest.spyOn(DB, "execute").mockResolvedValue(undefined);
    const init: PoolClient = await DB.init();
    const bulk: QueryResult[] | boolean = await DB.bulk(init, queries);
    expect(typeof bulk).toBe("boolean");
    expect(bulk).toBe(false);
  });

  /**
   * @brief Ejecuta una query a la base de datos
   * @assert Comprueba el resultado de la query y el metodo bulk se halla llamado
   */
  it("test executeQuery method with client", async () => {
    const initConnection: PoolClient = await DB.Pool.connect();
    jest.spyOn(DB, "schema").mockResolvedValue(true);
    mockedStart
    const mockBulk: jest.SpyInstance = jest
      .spyOn(DB, "bulk")
      .mockResolvedValue([objQueryResult]);
    const executeQuery: QueryResult[] | boolean = await DB.executeQuery(
      initConnection,
      query
    );
    expect(mockBulk).toHaveBeenCalled();
    expect(executeQuery[0].rows[0].users.user_name).toEqual("admin");
  });

  /**
   * @brief Ejecuta una query a la base de datos con transacción y error en el metodo bulk
   * @assert Compara que el valor retornado sea false y se halla llamado el metodo bulk
   */
  it("test executeQuery method with transaction", async () => {
    const initConnection: PoolClient = await DB.Pool.connect();
    mockedStart
    const mockBulk: jest.SpyInstance = jest
      .spyOn(DB, "bulk")
      .mockResolvedValue(false);
    const executeQuery: QueryResult[] | boolean = await DB.executeQuery(
      initConnection,
      queries,
      true
    );
    expect(mockBulk).toHaveBeenCalled();
    expect(executeQuery).toBe(false);
  });

  /**
   * @brief Ejecuta una query a la base de datos sin un cliente como parametro
   * @assert Comprueba que se halla llamado el metodo bulk y el resultado de la query
   */
  it("test executeQuery method without client", async () => {
    mockedStart
    const mockBulk: jest.SpyInstance = jest
      .spyOn(DB, "bulk")
      .mockResolvedValue([objQueryResult]);
    const executeQuery: QueryResult[] | boolean = await DB.executeQuery(
      undefined,
      query
    );
    expect(mockBulk).toHaveBeenCalled();
    expect(executeQuery[0].rows[0].users.user_name).toEqual("admin");
  });

  /**
   * @brief Verifica el metodo init sin transacción
   * @assert Comprueba que retorne un cliente
   */
  it("test init method without transaction", async () => {
    const mockInit: jest.SpyInstance = jest.spyOn(DB, "init");
    const execute: PoolClient = await DB.init();
    expect(typeof execute).toBe("object");
    expect(mockInit).toHaveBeenCalled();
  });

  /**
   * @brief Verifica el metodo init con transacción
   * @assert Comprueba que retorne un cliente
   */
  it("test init method with transaction", async () => {
    const mockInit: jest.SpyInstance = jest
      .spyOn(DB, "init")
      .mockResolvedValue(DB.Pool.connect());
    const execute: PoolClient = await DB.init(true);
    expect(mockInit).toHaveBeenCalled();
    expect(typeof execute).toBe("object");
  });

  /**
   * @brief Verifica que el metodo end libere el cliente sin transacción
   * @assert Compara que el cliente liberado sea un objeto
   */
  it("test end method without transaction", async () => {
    const initConnection: PoolClient = await DB.Pool.connect();
    const end: Promise<void> = DB.end(initConnection);
    expect(typeof end).toBe("object");
  });

  /**
   * @brief Verifica que el metodo end libere el cliente con transacción
   * @assert comprueba que la transacción se halla llamado
   */
  it("test end method with transaction", async () => {
    const initConnection: PoolClient = await DB.Pool.connect();
    const transacction: jest.SpyInstance = jest.spyOn(initConnection, "query");
    await DB.end(initConnection, true);
    expect(transacction).toHaveBeenCalled();
  });

  /**
   * @brief Verifica que el metodo end libere el cliente con transacción y estado
   * @assert Comprueba que la transacción se halla llamado
   */
  it("test end method with transaction and state", async () => {
    const initConnection: PoolClient = await DB.Pool.connect();
    const transacction: jest.SpyInstance = jest.spyOn(initConnection, "query");
    await DB.end(initConnection, true, true);
    expect(transacction).toHaveBeenCalled();
  });

  /**
   * @brief Realiza la ejecución de una query
   * @assert Comprueba que el valor retornado sea un objeto y una propiedad especifica de la query
   */
  it("test execute method", async () => {
    const mockExecute: jest.SpyInstance = jest
      .spyOn(DB, "execute")
      .mockResolvedValue(objQueryResult);
    const init: PoolClient = await DB.init();
    const execute: QueryResult = await DB.execute(init, query);
    expect(mockExecute).toHaveBeenCalled();
    expect(execute.rows[0].users.user_name).toEqual("admin");
    expect(typeof execute).toBe("object");
  });

  /**
   * @brief Verifica la presencia de comillas simples dentro de una query
   * @assert espera que contenga una cantidad especifica de caracteres
   */
  test("test sanitize method", () => {
    const mockSanitize: jest.SpyInstance = jest.spyOn(DB, "sanitize");
    const text: string =
      "prueba para testear las 'comillas' simples y cambiarlas";
    const test: string = DB.sanitize(text);
    expect(mockSanitize).toHaveBeenCalled();
    expect(test).toHaveLength(text.length + 2);
  });
});
