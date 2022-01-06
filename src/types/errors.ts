interface BaseError extends Error {
    description: string;
    httpCode: number;
    isOperational: boolean;
}

export { BaseError };
