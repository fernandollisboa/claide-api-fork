import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class InvalidAtributeError extends BaseError {
  constructor(
    attribute,
    value,
    message = `Invalid attribute ${attribute}: ${value}`,
    statusCode = httpStatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "InvalidAtributeError";
  }
}
