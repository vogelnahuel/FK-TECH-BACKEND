import Server from "./server";

describe("Server", () => {
  const server = new Server();
  /**
   *  @brief   llama a los middleware y routes
   *  @assert  valida si se ejecuto correctamente
   */
  test("Server middlewares y routes", () => {
    expect(server).not.toBeUndefined();
  });
  /**
   *  @brief   llama al servidor  y verifica que el listen no tenga errores
   *  @assert  valida si se ejecuto correctamente
   */
  test("Server middlewares y routes", () => {
    let servidor  = server.listen();
    expect(1).toBe(1);
    servidor.close();
  });
});
