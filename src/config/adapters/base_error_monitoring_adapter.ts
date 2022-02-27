export class BaseErrorMonitoringAdapter {
    constructor() {
        if (this.constructor === BaseErrorMonitoringAdapter) {
            throw new Error("Abstract classes can't be implemented");
        }
    }

    initialize() {
        throw new Error('Method "initialize()" must be implemented');
    }

    requestHandler() {
        throw new Error('Method "requestHandler()" must be implemented');
    }

    errorHandler() {
        throw new Error("Method 'errorHandler()' must be implemented");
    }
}
