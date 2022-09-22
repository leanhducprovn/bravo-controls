export class ArgumentNullException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'ArgumentNullException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, ArgumentNullException.prototype);
    }
}