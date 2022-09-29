import Login from "./login";

describe("Routes", () => {
  /**
   *  @brief   llama a /flexservice/api/login
   *  @assert  verifica que el path exista 
   */
  it("Login Router Post", () => {
    
    expect(Login._router.stack[2]).not.toBeUndefined();
    expect(Login._router.stack[2].route.path).toBe("/");
    expect(Login._router.stack[2].route.methods.post).toBe(true);
  });

});
