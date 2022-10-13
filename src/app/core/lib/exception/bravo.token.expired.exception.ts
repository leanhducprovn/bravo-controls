export class BravoTokenExpiredException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'BravoTokenExpiredException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, BravoTokenExpiredException.prototype);
    }
}
