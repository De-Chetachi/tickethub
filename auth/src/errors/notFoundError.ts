import { CustomError} from "./customError";

export class NotFoundError extends CustomError {
    statusCode = 404;
    
    constructor() {
        super ('route not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): { message: string; field?: string; }[] {
        return [{ message: "Not found" }];
    }
}