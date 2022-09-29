/**
 *  @brief clase para devolver errores de parametros invalidos
 */
export class InvalidParams extends Error {
    constructor (message:string) {
      super(message || 'NO_PARAMS');
      this.name = 'InvalidParams';
    }
  }
/**
 *  @brief clase para devolver errores cuando algo no se encuentra
 */
  export class NotFound extends Error {
    constructor (message:string) {
      super(message || 'Not found');
      this.name = 'NotFound';
    }
  }
/**
 *  @brief clase para devolver errores de negocio
 */
  export class BusinessError extends Error {
    constructor (message:string) {
      super(message || 'BusinessError');
      this.name = 'BusinessError';
    }
  }
