export class SyntaxErrorException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'SyntaxErrorException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, SyntaxErrorException.prototype);
    }
}