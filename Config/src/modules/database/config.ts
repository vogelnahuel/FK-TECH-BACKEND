import * as DotEnv from "dotenv";
DotEnv.config();

// Database
export const dbHost: string = process.env.DB_HOST || "localhost";
export const dbPort: number = parseInt(process.env.DB_PORT) || 5432;
export const dbName: string = process.env.DB_NAME || "flexv2";
export const dbUser: string = process.env.DB_USER || "flexServiceDBUser";
export const dbPassword: string = process.env.DB_PASSWORD || "Fl3xS3rv1c3";
export const dbMaxClients: number = parseInt(process.env.DB_MAX_CLIENTS) || 20;
export const dbIdleTimeout: number = parseInt(process.env.DB_IDLE_TIMEOUT) || 30000;
export const dbKeepAlive: boolean = (process.env.DB_KEEP_ALIVE === undefined) ? true : (process.env.DB_KEEP_ALIVE === "true" || process.env.DB_KEEP_ALIVE === "TRUE");
