export default class CustomError {
    static createError({ name = 'Error', cause, message, code }) {
      const error = new Error(message, { cause });
      error.name = name;
      error.cause = cause;
      error.message = message;
      error.code = code;
      throw error;
    }
  }