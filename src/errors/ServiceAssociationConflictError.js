import ConflictError from "./ConflictError";

export default class ServiceAssociationConflictError extends ConflictError {
  constructor(attribute, value) {
    super(attribute, value, "ServiceAssociation");
    this.name = "ServiceAssociationConflictError";
  }
}
