export class InvalidCastException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'InvalidCastException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, InvalidCastException.prototype);
    }
}
