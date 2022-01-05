const logger = require('./logger');

/*
Extends error to contain httpCode and isOperational attributes.
Operational errors can usually be handled and don't require exiting the application
Programmer errors represent unexpected bugs in poorly written code.
Programmer errors should exit the application.
*/
class BaseError extends Error {
    description: string;
    httpCode: number;
    isOperational: boolean;
    constructor(description: string, httpCode: number, isOperational: boolean) {
        super(description);
        this.description = description;
        Object.setPrototypeOf(this, new.target.prototype);
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

class NotFoundError extends BaseError {
    constructor(description = 'not found', httpCode = 404, isOperational = true) {
        super(description, httpCode, isOperational);
    }
}

class APIError extends BaseError {
    constructor(description = 'internal server error', httpCode = 500, isOperational = true) {
        super(description, httpCode, isOperational);
    }
}

class UnauthorizedError extends BaseError {
    constructor(description = 'The request lacks valid authentication credentials', httpCode = 401, isOperational = true) {
        super(description, httpCode, isOperational);
    }
}

/* 
Wraps the loggger created and the custom error class to handle errors.
It could be extended to also include sending notification events to developers about critical errors.
*/

class ErrorHandler {
    async handleError(err: Error) {
        if (!this.isTrustedError(err)) {
            logger.fatal('Error message: ', err);
            process.exit(1);
        }
        logger.info('Error message', err);
    }

    isTrustedError(error: Error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}
const errorHandler = new ErrorHandler();

export default errorHandler;
export { BaseError, APIError, UnauthorizedError, NotFoundError };
