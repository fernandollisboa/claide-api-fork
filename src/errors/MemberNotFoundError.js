import NotFoundError from "./NotFoundError";

export default class MemberNotFoundError extends NotFoundError {
  constructor(atribute, value) {
    super(atribute, value, "Member");
    this.name = "MemberNotFoundError";
  }
}
