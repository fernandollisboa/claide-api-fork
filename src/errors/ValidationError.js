import httpStatusCode from "../enum/httpStatusCode";

export default class ValidationError extends Error {
  constructor(message, statusCode = httpStatusCode.UNPROCESSABLE_ENTITY) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ValidationError";
  }
}
