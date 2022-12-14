import NotFoundError from "./NotFoundError";

export default class ProjectAssociationNotFoundError extends NotFoundError {
  constructor(atribute, value) {
    super(atribute, value, "Project association");
    this.name = "ProjectAssociationNotFoundError";
  }
}
