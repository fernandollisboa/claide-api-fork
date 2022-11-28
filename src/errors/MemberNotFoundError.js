import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class MemberNotFoundError extends BaseError {
  constructor(
    atribute,
    value,
    message = `Member with ${atribute}: ${value} not found`,
    statusCode = httpStatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "MemberNotFoundError";
  }
}
