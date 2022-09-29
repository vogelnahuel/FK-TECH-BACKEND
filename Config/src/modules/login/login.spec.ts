import { LoginRequest } from "./loginRequest";
import { DatabaseUsers, LoginResponseData } from "./loginInterface";
import { LoginService } from "./loginServices";
import { UserDao } from "../../dao/user/userDao";
import { DatabaseUser } from "../../constants/loginDatabase";
import httpMocks from "node-mocks-http";
import { LoginController } from "./loginControllers";
import { UrlConstants } from "../../constants/urlConstants";
import { HTTP_CODES } from "../../utils/http";
describe("Login Controller/Service ", () => {
  const response = httpMocks.createResponse();
  const UpdateMock: jest.SpyInstance<Promise<void>> = jest
    .spyOn(UserDao, "updateToken")
    .mockResolvedValue();
  afterEach(() => {
    jest.clearAllMocks();
  });
  /**
   *  @brief  verifica que la respuesta de la logica del negocio sea correcta segun params
   *  @assert  username  es igual a admin
   */
  test("Login LoginPostService Positive", async () => {
    const reqBody: LoginRequest = {
      document: "12345678",
      password: "be46d161e3e0bc74c9863a5a082be78b",
    };
    const FindDocumentMock: jest.SpyInstance<Promise<DatabaseUsers>> = jest
      .spyOn(UserDao, "findByDocument")
      .mockResolvedValue(DatabaseUser);

    const response: LoginResponseData = await LoginService.LoginPostService(
      reqBody
    );
    expect(FindDocumentMock).toHaveBeenCalled();
    expect(UpdateMock).toHaveBeenCalled();
    expect("admin").toEqual(response.userName);
    FindDocumentMock.mockClear();
    UpdateMock.mockClear();
  });
  /**
   *
   *  @brief  verifica que la respuesta de la logica del negocio sea incorrecta segun params error no existe documento ni pass
   *  @assert  compara si devuelve un error de usuario o password
   */
  test("Login LoginPostService Negative", async () => {
    const reqBody: LoginRequest = {
      document: "",
      password: "",
    };
    const FindDocumentMock: jest.SpyInstance<Promise<DatabaseUsers>> =
      jest.spyOn(UserDao, "findByDocument");

    try {
      await LoginService.LoginPostService(reqBody);
    } catch (error) {
      expect(FindDocumentMock).toHaveBeenCalled();
      expect(UpdateMock).not.toHaveBeenCalled();
      expect("The document or password is invalid").toEqual(error.message);
    }
    FindDocumentMock.mockClear();
    UpdateMock.mockClear();
  });
  /**
   *
   *  @brief  verifica que la respuesta de la logica del negocio sea incorrecta segun params error password no coincide con la ultima
   *  @assert  compara si devuelve un error de document o password
   */
  test("Login LoginPostService Negative", async () => {
    const reqBody: LoginRequest = {
      document: "12345678",
      password: "test",
    };
    const FindDocumentMock: jest.SpyInstance<Promise<DatabaseUsers>> = jest
      .spyOn(UserDao, "findByDocument")
      .mockResolvedValue(DatabaseUser);

    try {
      await LoginService.LoginPostService(reqBody);
    } catch (error) {
      expect(FindDocumentMock).toHaveBeenCalled();
      expect(UpdateMock).not.toHaveBeenCalled();
      expect("The document or password is invalid").toEqual(error.message);
    }
    FindDocumentMock.mockClear();
    UpdateMock.mockClear();
  });
  /**
   *
   *  @brief  verifica que la respuesta  del controllador sea correcta en base al documento y el pass
   *  @assert  compara si devuelve un error de document o password  o 200 todo ok
   */
  test("Login loginControllers positive", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}`,
      body: {
        document: "12345678",
        password: "be46d161e3e0bc74c9863a5a082be78b",
      },
    });
    const FindDocumentMock: jest.SpyInstance<Promise<DatabaseUsers>> = jest
      .spyOn(UserDao, "findByDocument")
      .mockResolvedValue(DatabaseUser);

    await LoginController.LoginPost(req, response);

    expect(response.statusCode).toBe(HTTP_CODES.OK);
    expect(FindDocumentMock).toHaveBeenCalled();
    expect(UpdateMock).toHaveBeenCalled();
    FindDocumentMock.mockClear();
    UpdateMock.mockClear();
  });
  /**
   *  @brief  verifica que la respuesta del controllador sea incorrecta en base al documento que no existe y el pass
   *  @assert  compara si devuelve un error de document o password o 400 bad request
   */
  test("Login loginControllers negative", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: `${UrlConstants.URL_ENDPOINT_LOGIN}`,
      body: {
        document: "",
        password: "be46d161e3e0bc74c9863a5a082be78b",
      },
    });
    const FindDocumentMock: jest.SpyInstance<Promise<DatabaseUsers>> = jest
      .spyOn(UserDao, "findByDocument")
      .mockImplementation(); //limpia el resultado anterior

    await LoginController.LoginPost(req, response);

    expect(response.statusCode).toBe(HTTP_CODES.NO_CONTENT);
    expect(FindDocumentMock).toHaveBeenCalled();

    FindDocumentMock.mockClear();
    UpdateMock.mockClear();
  });
});
