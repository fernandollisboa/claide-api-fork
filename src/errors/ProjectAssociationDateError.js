import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class ProjectAssociationDateError extends BaseError {
  constructor(
    message = `The association can't start before the project creation or end after the project ends`,
    statusCode = httpStatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ProjectAssociationDateError";
  }
}
