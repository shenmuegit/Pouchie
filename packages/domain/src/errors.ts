export class DomainError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.status = status;
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "未授权访问") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "资源不存在") {
    super("NOT_FOUND", message, 404);
  }
}

export class ConflictError extends DomainError {
  constructor(message = "资源冲突") {
    super("CONFLICT", message, 409);
  }
}

export class ValidationError extends DomainError {
  constructor(message = "参数错误") {
    super("VALIDATION_ERROR", message, 422);
  }
}

