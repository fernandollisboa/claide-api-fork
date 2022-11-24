import httpStatusCode from "../enum/httpStatusCode";
import BaseError from "./BaseError";

const MINIMUM_REQUIRED_AGE = 15;

export default class MemberTooYoungError extends BaseError {
  constructor(message = `"birthDate" is invalid, member must be at least ${MINIMUM_REQUIRED_AGE}`) {
    super(message, httpStatusCode.BAD_REQUEST);
    this.message = message;
  }
}
