import ConflictError from "./ConflictError";

export default class MemberConflictError extends ConflictError {
  constructor(attribute, value) {
    super(attribute, value, "Member");
    this.name = "MemberConflictError";
  }
}
