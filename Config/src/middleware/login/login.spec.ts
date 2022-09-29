import httpMocks from "node-mocks-http";
import { LoginValidator } from "./loginMiddleware";
import { UrlConstants } from "../../constants/urlConstants";
describe("Login middleware Login", () => {
  const res = httpMocks.createResponse();
  const next: jest.Mock<any, any> = jest.fn();
  afterEach(()=>{
    jest.clearAllMocks();
  })
  /**
   *
   *  @brief verifica que las validaciones del request sean correctas segun document y password
   *  @assert  valida si se ejecuta correctamente la llamada de la clase validadora
   */
  test("Login Validator Positive", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}`,
      body: {
        document: "12345678",
        password: "Password01",
        country:"AR",
        store:"LAR"
      },
    });
   
    await LoginValidator(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  /**
   *
   *  @brief verifica que las validaciones del request sean incorrectos segun document y password
   *  @assert  valida si se ejecuta incorrectamente la llamada de la clase validadora
   */
  test("Login Validator Negative No Body", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}`,
    });
   
    await LoginValidator(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
  /**
   *
   *  @brief verifica que las validaciones del request sean incorrectos segun document y password
   *  @assert  valida si se ejecuta incorrectamente la llamada de la clase validadora
   */
  test("Login Validator Negative", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}`,
      body: {
        document: "",
        password: "Password01",
      },
    });

    await LoginValidator(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
