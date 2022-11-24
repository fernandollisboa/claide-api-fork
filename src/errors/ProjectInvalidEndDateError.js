import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class ProjectInvalidEndDateError extends BaseError {
  constructor(
    date,
    message = `Creation date ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} older than end date`,
    statusCode = httpStatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ProjectInvalidEndDateError";
  }
}
