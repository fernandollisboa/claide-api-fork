import httpStatusCode from "../enum/httpStatusCode";

export default class ProjectInvalidAtributeError extends Error {
  constructor(
    attribute,
    value,
    message = `Invalid attribute ${attribute}: ${value}`,
    statusCode = httpStatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ProjectInvalidAtributeError";
  }
}
