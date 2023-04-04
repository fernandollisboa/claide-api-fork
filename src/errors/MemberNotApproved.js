import BaseError from "./BaseError";
import httpStatusCode from "../enum/httpStatusCode";

export default class MemberNotApproved extends BaseError {
  constructor(
    memberName,
    message = `Member "${memberName}" is not approved`,
    statusCode = httpStatusCode.PRECODITION_REQUIRED
  ) {
    super(message, statusCode);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "MemberNotApproved";
  }
}
