import fs from "fs";
import path from "path";
import { Pool, PoolClient, PoolConfig, QueryResult } from "pg";
import log from "../../utils/logger";
import * as config from "./config";
import { _TRANSACTION } from "../../constants/database";

export class Database {
  private pool: Pool;

  private static initialized: boolean = false;
  private static schema: boolean = false;
  private static configPool: PoolConfig = {
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
    host: config.dbHost,
    port: config.dbPort,
    max: config.dbMaxClients,
    idleTimeoutMillis: config.dbIdleTimeout,
    keepAlive: config.dbKeepAlive,
  };

  constructor() { }

  get Pool() {
    return this.pool;
  }

  static get ConfigPool() {
    return Database.configPool;
  }

  set Pool(pool: Pool) {
    this.pool = pool;
  }

  static set Initialized(value) {
    Database.initialized = value;
  }

  static set Schema(value) {
    Database.schema = value;
  }
  /**
   * Method Inicia el servicio de acceso a bases de datos
   *
   * @return true o false
   *
   */
  async start(): Promise<boolean> {
    if (!Database.initialized) {
      console.log("db.js (start): server initialization");
      // Inicializa el pool de conexiones
      this.pool = new Pool( Database.configPool);
      log.info("pool initialized");
      // Captura eventos de error del pool
      this.pool.on("error", (err: Error) => {
        log.error(`db.js (start): idle client error (${err.message}`);
        console.error(`db.js (start): idle client error (${err.message})`);
      });

      // Define como inicializado al modulo
      Database.initialized = true;
      Database.schema = await this.schema();
      if (!Database.schema) return false;

      console.log(
        `db.js (start): server is running on postgresql://${config.dbUser}@${
          config.dbHost || "localhost"
        }:${config.dbPort || 5432}/${config.dbName}`
      );
      return true;
    } else {
      // Verifica si se ejecuto correctamente el esquema
      if (Database.schema) return true;
      // Ejecuta scripts de inicio de la base de datos
      Database.schema = await this.schema();
      // Valida si el esquema dio error
      if (!Database.schema) return false;

      log.info("server postgres running");
      console.log(
        `db.js (start): server is running on postgresql://${config.dbUser}@${
          config.dbHost || "localhost"
        }:${config.dbPort || 5432}/${config.dbName}`
      );
      return true;
    }
  }

  /**
   * Crea el schema de la base de datos
   *
   */
  async schema(): Promise<boolean> {
    // Solicitamos conexion al pool
    const client: PoolClient = await this.pool.connect();
    if (!client) {
      console.error(
        "db.js (schema): unable to get an instance of the database connection"
      );
      return false;
    }
    // obtengo los scripts y los ejecuto
    const fileDir: string = path.join(
      __dirname,
      __dirname.includes("dist") ? "../../../etc/db" : "../../etc/db"
    );
    const files: string[] = fs
      .readdirSync(fileDir)
      .filter((file) => path.extname(file) === ".sql");

    for (let file of files) {
      const scripts: string = fs.readFileSync(path.join(fileDir, file), {
        encoding: "utf-8",
        flag: "r",
      });

      await client.query(scripts);
    }
    client.release(true);
    console.log("db.js (schema): database structure verified");
    log.info("database structure verified");
    return true;
  }

  /**
   * Recibe un array sentencias SQL y las ejecuta en orden, retorna
   * un array con los resultados de cada una
   *
   * @param client     Instancia de la conexion o undefined para crear una nueva
   * @param queries    lista de queries a ejecutar
   * @return           resultados de las consultas o false
   *
   */
  async bulk(
    client: PoolClient,
    queries: string[]
  ): Promise<QueryResult[] | boolean> {
    const results: QueryResult[] = [];

    if (!client) {
      console.error(
        "db.js (bulk): la instancia de la conexion a base de datos es invalida"
      );
      return false;
    }

    for (let query of queries) {
      const result = await this.execute(client, query);
      if (!result) return false;

      results.push(result);
    }

    return results;
  }

  /**
   * Metodo que realiza la ejecución de una query
   *
   *  @param client          instancia de la conexion
   *  @param query           Sentencia sql
   */
  async execute(client: PoolClient, query: string): Promise<QueryResult> {
    return client.query(query);
  }

  /**
   * Ejecuta una query en la base de datos y retorna el resultado
   *
   * @param client          instancia de la conexion o undefined para crear una nueva
   * @param sql             sentencia/s que se requieren ejecutar
   * @param transaction     true si se ejecuta dentro de una transaccion
   * @return                resultados de las consultas o false
   */
  async executeQuery(
    client: PoolClient,
    sql: string | string[],
    transaction: boolean = false
  ): Promise<QueryResult[] | boolean> {
    let tmp: PoolClient = client;
    let ret: QueryResult[] | boolean = false;

    // Array para ejecución de queries
    let queries = [];

    this.start();

    // Solicitamos una conexión al pool si es necesario
    if (!tmp) tmp = await this.pool.connect();

    // Si se requiere una transacción
    if (transaction) queries.push(_TRANSACTION.BEGIN);

    // Si es un array
    if (Array.isArray(sql)) {
      queries = queries.concat(sql);
    } else {
      queries.push(sql);
    }

    // Si se requiere una transacción
    if (transaction) queries.push(_TRANSACTION.COMMIT);

    // Ejecuta la query/ies
    const results = await this.bulk(tmp, queries);
    if (results === false) {
      // Hace un roolback si esta es una transacción
      if (transaction) {
        // Ejecuta las queries
        log.warn("rollback is executing because there are some errors");
        console.warn(
          "db.js (execute): ocurrio un error, se ejecuta un rollback de la transaction"
        );
        await this.bulk(tmp, [_TRANSACTION.ROLLBACK]);
      }
    } else {
      ret = results;
    }

    // Libera la conexión
    if (!client) tmp.release();

    return ret;
  }

  /**
   * Init database
   * @brief Inicializa un cliente
   * @param transaction Inicia una transacción
   * @returns Cliente
   */
  async init(transaction: boolean = false): Promise<PoolClient> {
    const client = await this.pool.connect();
    if (transaction) client.query(_TRANSACTION.BEGIN);

    return client;
  }

  /**
   * End database
   * @brief Finaliza un cliente
   * @param transaction Finaliza una transacción si fue aperturada para ese cliente
   * @returns
   */
  async end(
    client: PoolClient,
    transaction: boolean = false,
    state: boolean = false
  ): Promise<void> {
    let queryString: string = null;
    if (transaction)
      queryString = state ? _TRANSACTION.COMMIT : _TRANSACTION.ROLLBACK;

    if (queryString) await client.query(queryString);
    client.release();
  }

  /**
   * Funcion para sanitizar una cadena de texto antes de insertarla dentro de la query
   *
   * @param json    json string a sanitizar
   * @return        json string sanitizado
   */
  sanitize(text: string): string {
    // Si no se encuentra undefined
    if (text) {
      // Escapa comillas simples
      return text.replace(/'/g, "''");
    }
  }
}

export default new Database();
