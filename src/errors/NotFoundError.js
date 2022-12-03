import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class NotFoundError extends BaseError {
  constructor(
    atribute,
    value,
    entity = "Entity",
    message = `${entity} with ${atribute}: ${value} not found`,
    statusCode = httpStatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
  }
}
