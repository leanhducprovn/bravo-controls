export class InvalidConstraintException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'InvalidConstraintException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, InvalidConstraintException.prototype);
    }
}
