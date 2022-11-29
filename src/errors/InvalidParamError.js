import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class InvalidParamError extends BaseError {
  constructor(
    atribute,
    value,
    message = `Invalid ${atribute}: ${value}`,
    statusCode = httpStatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "InvalidParamError";
  }
}
