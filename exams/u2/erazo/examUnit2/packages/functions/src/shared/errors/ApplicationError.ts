export class ApplicationError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(400, message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}
