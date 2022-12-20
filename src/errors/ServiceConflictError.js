import ConflictError from "./ConflictError";

export default class ServiceConflictError extends ConflictError {
  constructor(attribute, value) {
    super(attribute, value, "Service");
    this.name = "ServiceConflictError";
  }
}
