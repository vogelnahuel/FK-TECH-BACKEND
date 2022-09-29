
import Server from './models/server'
import DB from "./modules/database/database";
import * as DotEnv from "dotenv";
import log from "./utils/logger";


try {
    DotEnv.config();

    // Pool de conexiones a la DB
    DB.start();

    const server: Server = new Server();

    server.listen();
    log.info('server initialized')

} catch (error) {
    console.error( error )
}
