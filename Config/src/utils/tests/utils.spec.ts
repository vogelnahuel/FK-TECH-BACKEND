import log from "../logger";
import { setDate } from "../date";
import fs from "fs";
import path from "path";

describe("testing utils", () => {
  const fileName: string = new Date()
    .toISOString()
    .replace(/-/g, "")
    .split("T")[0];
  const dir: string = path.join(__dirname, "../../../logs");
  const objToString = {name:'admin', text: 'testing'}

  it("test info method with a string", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "info");
    log.info("test");
    const result: boolean = fs.existsSync("./logs");
    const readFile: string[] = fs.readdirSync(dir);
    expect(logger).toHaveBeenCalled();
    expect(result).toBe(true);
    expect(readFile.join()).toContain(fileName);
  });

  it("test info method with an object", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "info");
    log.info(objToString);
    const isExistingDir: boolean = fs.existsSync("./logs");
    const readFile: string[] = fs.readdirSync(dir);
    expect(logger).toHaveBeenCalled();
    expect(isExistingDir).toBe(true);
    expect(readFile.join()).toContain(fileName);
  });

  it("test debug method with a string", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "debug");
    log.debug("test");
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch('debug')
  });

  it("test debug method with an object", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "debug");
    log.debug(objToString);
    const debugString = JSON.stringify(objToString)
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch(debugString)
  });

  it("test trace method with a string", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "trace");
    log.trace("test");
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch('trace')
  });

  it("test trace method with an object", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "trace");
    log.trace(objToString);
    const traceString = JSON.stringify(objToString)
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch(traceString)
  });

  it("test warn method with a string", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "warn");
    log.warn("test");
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch('warn')
  });

  it("test warn method with an object", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "warn");
    log.warn(objToString);
    const warnString = JSON.stringify(objToString)
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch(warnString)
  });

  it("test error method with a string", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "error");
    log.error("test");
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch('error')
  });

  it("test error method with an object", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "error");
    log.error(objToString);
    const errorString = JSON.stringify(objToString)
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch(errorString)
  });

  it("test fatal method with a string", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "fatal");
    log.fatal("test");
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch('fatal')
  });

  it("test fatal method with an object", () => {
    const logger: jest.SpyInstance = jest.spyOn(log, "fatal");
    log.fatal(objToString);
    const fatalString = JSON.stringify(objToString)
    const readFile: string[] = fs.readdirSync(dir);
    const text: string = fs.readFileSync(
      path.join(__dirname, `../../../logs/${readFile[0]}`),
      { encoding: "utf8" }
    );
    expect(logger).toHaveBeenCalled();
    expect(text).toMatch(fatalString)
  });

  it("test setDate function", () => {
    const date: string = setDate();
    expect(date).toHaveLength(21);
    expect(typeof date).toBe("string");
    expect(date.split("-")[0]).toMatch(String(new Date().getFullYear()));
    expect(date.split("-")[1]).toMatch(
      String(new Date().getMonth() + 1).padStart(2, "0")
    );
    expect(date.split("-")[2]).toMatch(
      String(new Date().getDate()).padStart(2, "0")
    );
    expect(date.split("-")[3]).toMatch(String(new Date().getSeconds()));
  });
});
