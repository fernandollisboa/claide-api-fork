import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class UserUnauthorizedOrNotFoundError extends BaseError {
  constructor(
    username,
    message = `User "${username}" does not exist or is not authorized`,
    statusCode = httpStatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "UserUnauthorizedOrNotFoundError";
  }
}
