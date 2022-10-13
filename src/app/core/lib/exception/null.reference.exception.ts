export class NullReferenceException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'NullReferenceException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, NullReferenceException.prototype);
    }
}
