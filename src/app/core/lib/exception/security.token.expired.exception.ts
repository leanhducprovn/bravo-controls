export class SecurityTokenExpiredException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'SecurityTokenExpiredException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, SecurityTokenExpiredException.prototype);
    }
}