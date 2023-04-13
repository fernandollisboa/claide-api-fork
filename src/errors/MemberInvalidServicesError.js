import BaseError from "./BaseError";
import httpStatusCode from "../enum/httpStatusCode";

export default class MemberInvalidServicesError extends BaseError {
  constructor(
    atribute,
    value,
    message = `Invalid ${atribute}: ${value}`,
    statusCode = httpStatusCode.BAD_REQUEST
  ) {
    super(message, httpStatusCode.BAD_REQUEST);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "MemberInvalidServicesError";
  }
}
