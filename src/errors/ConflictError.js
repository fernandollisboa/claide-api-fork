import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class ConflictError extends BaseError {
  constructor(
    attribute,
    value,
    entity = "Entity",
    message = `${entity} with ${attribute}: "${value}" already registered, duplicate data`,
    statusCode = httpStatusCode.CONFLICT
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ConflictError";
    this.errorLabels = [attribute];
  }
}
