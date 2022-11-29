import dayjs from "dayjs";
import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

export default class ProjectInvalidCreationOrEndDateError extends BaseError {
  constructor(
    creationDate,
    endDate,
    message = `Error: creationDate (${dayjs(creationDate).format(
      "DD/MM/YYYY"
    )}) must be before endDate (${dayjs(endDate).format("DD/MM/YYYY")})`,
    statusCode = httpStatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ProjectInvalidCreationOrEndDateError";
  }
}
