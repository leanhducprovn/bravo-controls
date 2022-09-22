export class SecurityTokenException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'SecurityTokenException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, SecurityTokenException.prototype);
    }
}