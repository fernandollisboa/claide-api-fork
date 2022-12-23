import NotFoundError from "./NotFoundError";

export default class ServiceNotFoundError extends NotFoundError {
  constructor(atribute, value) {
    super(atribute, value, "Service");
    this.name = "ServiceNotFoundError";
  }
}
