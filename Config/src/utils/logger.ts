import fs from "fs";
import path from "path";
import { setDate } from "./date";
import * as DotEnv from "dotenv";
DotEnv.config();


class Log {
  name: string;
  path: string;
  fileName: string;

  constructor(name: string, dir = "./logs") {
    this.name = name;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const timeToFileName = new Date()
      .toISOString()
      .replace(/-/g, "")
      .split("T")[0];
    this.fileName = `${timeToFileName}_${this.name}.log`;
    this.path = path.join(dir, this.fileName);
  }

  log(level: string, message: string) {
    const output: string =
      `${setDate()} ${this.name} ${level} ${message}` + "\r\n";
    fs.writeFileSync(this.path, output, { encoding: "utf8", flag: "a" });
  }

  info(message: unknown) {
    if( typeof message === 'object')
      this.log("info", JSON.stringify(message))
    if( typeof message === 'string')
      this.log("info", message);
  }

  debug(message: unknown) {
    if( typeof message === 'object')
      this.log("debug", JSON.stringify(message));
    if( typeof message === 'string')
      this.log("debug", message);
  }

  trace(message: unknown) {
    if( typeof message === 'object')
      this.log("trace", JSON.stringify(message))
    if( typeof message === 'string')
      this.log("trace", message);
  }

  warn(message: unknown) {
    if( typeof message === 'object')
      this.log("warn", JSON.stringify(message))
    if( typeof message === 'string')
      this.log("warn", message);
  }

  error(message: unknown) {
    if( typeof message === 'object')
      this.log("error", JSON.stringify(message))
    if( typeof message === 'string')
      this.log("error", message);
  }

  fatal(message: unknown) {
    if( typeof message === 'object')
      this.log("fatal", JSON.stringify(message))
    if( typeof message === 'string')
      this.log("fatal", message);
  }
}

export default new Log(process.env.SERVICE_NAME);
