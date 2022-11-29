import NotFoundError from "./NotFoundError";

export default class ProjectNotFoundError extends NotFoundError {
  constructor(atribute, value) {
    super(atribute, value, "Project");
    this.name = "ProjectNotFoundError";
  }
}
