interface BaseError extends Error {
    description: string;
    httpCode: number;
    isOperational: boolean;
    data?: string[];
    status: string;
}

export { BaseError };
