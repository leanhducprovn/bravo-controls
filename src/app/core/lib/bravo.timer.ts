import { Event } from '@grapecity/wijmo';
import { Observable, Subscription, interval } from 'rxjs';

export class Timer {
    private _source: Observable<number>;
    private _subscribe: Subscription;

    public readonly tick: Event = new Event();

    private _enabled: boolean = true;
    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        this._enabled = value;
    }

    private _interval: number = 1000;
    public get interval(): number {
        return this._interval;
    }

    public set interval(value: number) {
        if (this._interval == value) return;

        this._interval = value;

        this.stop();

        if (this._source) this._source = interval(this._interval);
    }

    public get isRunning(): boolean {
        return !!this._subscribe;
    }

    private _tag: any;

    public get tag(): any {
        return this._tag;
    }

    public set tag(v: any) {
        this._tag = v;
    }

    public start() {
        if (this._subscribe) return;
        if (!this._source) this._source = interval(this.interval);

        this._subscribe = this._source.subscribe(() => {
            if (this.enabled && this.tick.hasHandlers) this.tick.raise(this);
        });
    }

    public stop() {
        if (this._subscribe) {
            this._subscribe.unsubscribe();
            this._subscribe = null;
        }
    }

    public dispose() {
        this.stop();
        this._source = null;
    }
}
