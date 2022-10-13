export class SqlException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'SqlException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, SqlException.prototype);
    }
}
