import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Http } from "../http";

/**
 *
 *  @brief genera un token aplicando las reglas que se requieran
 *  @param document documento
 *  @returns  un JWT encriptado
 */
export const generateToken = (document: string): string => {
  const token: string = jwt.sign({ data: document }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.EXPIRATION_TOKEN,
  });
  return token;
};

/**
 *  @brief genera una fecha de expiracion para guardarlo a la base en la DB
 *  @returns  fecha de expiracion del token
 */

export const expirationToken = (): string => {
  const actualDate: Date = new Date();
  actualDate.setHours(actualDate.getHours() + 8);

  let d: Date = new Date(actualDate),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = "" + d.getHours(),
    minutes = ""+d.getMinutes(),
    seconds = ""+d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (minutes.length < 2) minutes = "0" + minutes;
  if (seconds.length < 2) seconds = "0" + seconds;
  return [year, month, day].join("") + "" + [hour, minutes, seconds].join("");
};
/**
 *
 *  @brief verifica el jwt pasado en el header
 *  @returns  un http error o sigue de largo
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 if (!URLS_WITHOUT_TOKEN_SESSION[req.url]) {
    if (!req.url.includes("/api-docs/") ) {
      const authHeader: string = req?.headers?.token as string;
      if (!authHeader) {
        return Http.Unauthorized("Invalid authorization", res);
      }
      jwt.verify(authHeader, process.env.PRIVATE_KEY, (err) => {
        if (err) {
          return Http.Unauthorized("Invalid authorization", res);
        }
      });
    }
  }
  else{
    next();
  }
};
const URLS_WITHOUT_TOKEN_SESSION = {
  "/flexservice/api/login": String,
};
