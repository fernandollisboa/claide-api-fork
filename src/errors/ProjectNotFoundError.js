import NotFoundError from "./NotFoundError";

export default class ProjectNotFoundError extends NotFoundError {
  constructor(atribute, value) {
    super(atribute, value, "Member");
    this.name = "ProjectNotFoundError";
  }
}
