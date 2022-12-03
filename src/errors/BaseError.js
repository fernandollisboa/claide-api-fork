/**
 * BaseError defines basic atributes for all the custom-made Errors in the application.
 * Every new custom Error must be an instance of BaseError
 * @author fernandollisboa
 *
 */
export default class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
