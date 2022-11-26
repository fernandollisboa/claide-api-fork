import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class ProjectNotFoundError extends BaseError {
  constructor(
    atribute,
    value,
    message = `Project with ${atribute}: ${value} not found`,
    statusCode = httpStatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ProjectNotFoundError";
  }
}
