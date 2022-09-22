import { Subscription } from 'rxjs';

export class CancellationToken extends Subscription {
    private _exception: Error;

    public get isCancellationRequested(): boolean {
        return this._exception != null && this.closed;
    }

    public throwIfCancellationRequested() {
        if (this.closed) {
            console.log('++++++++++++Cancel token');
            this._exception = new OperationCanceledException('Cancel token');
            throw this._exception;
        }
    }
}

export class Semaphore {
    private _n: number;
    private _timemerWait: Array<number>;

    constructor(n) {
        this._n = n;
        this._timemerWait = new Array();
    }

    public async start() {
        while (this._n <= 0) await this.wait();
        this._n--;
    }

    public end() {
        this._n++;
    }

    public dispose() {
        if (this._timemerWait) {
            for (const _id of this._timemerWait) {
                clearTimeout(_id);
            }

            this._timemerWait.clear();
            this._timemerWait = null;
        }
    }

    private async wait() {
        if (this._n <= 0) return await new Promise((res, req) => {
            if (!this._timemerWait)
                this._timemerWait = new Array();

            this._timemerWait.push(setTimeout(async () => res(await this.wait())));
        });
        return;
    }
}

export class OperationCanceledException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'OperationCanceledException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, OperationCanceledException.prototype);
    }
}