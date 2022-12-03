import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class InvalidDateError extends BaseError {
  constructor(
    date,
    message = `Date informed (${date}) is invalid`,
    statusCode = httpStatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "InvalidDateError";
  }
}
