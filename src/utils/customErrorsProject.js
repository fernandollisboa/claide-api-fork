export class EndDateError extends Error {
  constructor(date) {
    super(
      `Creation date ${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} older than end date`
    );
    this.type = "EndDateError";
  }
}

export class NotFoundError extends Error {
  constructor(atribute, value) {
    super(`Project with ${atribute}: ${value} not found`);
    this.type = "NotFoundError";
  }
}

export class InvalidAttribute extends Error {
  constructor(attribute, value) {
    super(`Invalid attribute ${attribute}: ${value}`);
    this.type = "InvalidAttribute";
  }
}
