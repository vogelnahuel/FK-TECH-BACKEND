import { expirationToken, generateToken, verifyToken } from "./token";
import httpMocks from "node-mocks-http";
import * as DotEnv from "dotenv";
import { UrlConstants } from "../../constants/urlConstants";
DotEnv.config();
describe("Users Token", () => {
  const response = httpMocks.createResponse();
  const next: jest.Mock<any, any> = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });
  /**
   *
   *  @brief  verifica que la respuesta del generar token
   *  @assert  compara si la respuesta es un string
   */
  test("Login generateToken Positive", async () => {
    const res: string = generateToken("12345678");
    expect(typeof res).toBe("string");
  });
  /**
   *
   *  @brief  verifica que la respuesta del expirationToken
   *  @assert  compara si la respuesta es un string
   */
  test("Login expirationToken Positive", async () => {
    const res: string = expirationToken();
    expect(typeof res).toBe("string");
    expect(res).toHaveLength(14);
  });
  /**
   *
   *  @brief  verifica que el metodo funcione  correctamente
   *  @assert  compara si se ejecuto correctamente la funcion next()
   */
  test("Login verifyToken Positive", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}`,
    });

    verifyToken(req, response, next);
    expect(next).toHaveBeenCalled();
    next.mockClear();
  });
  /**
   *
   *  @brief  verifica que el metodo funcione  incorrectamente url pide token
   *  @assert  compara si se ejecuto incorrectamente la funcion next()
   */
  test("Login verifyToken Negative", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}/dashboard`,
    });
    verifyToken(req, response, next);
    expect(next).not.toHaveBeenCalled();
    next.mockClear();
  });

  /**
   *
   *  @brief  verifica que el metodo funcione  correctamente  el token esta vencido
   *  @assert  compara si se ejecuto correctamente la funcion next()
   */
  test("Login verifyToken negative token", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}/dashboard`,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMzk3NjY1MDEiLCJpYXQiOjE2NDc4OTA5NjQsImV4cCI6MTY0NzkxOTc2NH0.EnRBo7REtjZfksT5kZIhNwyoz3ggmTOxQ92Soascy_8",
    });
    verifyToken(req, response, next);
    expect(next).not.toHaveBeenCalled();
    next.mockClear();
  });
});
