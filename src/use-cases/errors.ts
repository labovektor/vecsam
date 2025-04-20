export class PublicError extends Error {
  code: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "PublicError";
    this.code = code ?? "UNKNOWN_ERROR";
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("Kamu harus masuk terlebih dahulu!", "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends PublicError {
  constructor() {
    super("Oops! tidak ditemukan.", "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}

export class InvalidSessionError extends PublicError {
  constructor() {
    super("Sesi tidak valid.", "INVALID_SESSION_ERROR");
    this.name = "InvalidSessionError";
  }
}

export class SessionUsedError extends PublicError {
  constructor() {
    super("Sesi telah digunakan.", "SESSION_USED_ERROR");
    this.name = "SessionUsedError";
  }
}
