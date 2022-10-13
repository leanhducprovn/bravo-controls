import * as wjc from '@grapecity/wijmo';
import { BroadCastEventArgs } from './eventArgs/broadcast.event.args';

export class BravoBroadcastChannel {
    private _broadCast: BroadcastChannel;

    private _zChannelName: string;

    public get channelName(): string {
        return this._zChannelName;
    }

    public onDataChanged = new wjc.Event();

    constructor(
        pzChannelName: string,
        pbUsingBroadCastChannel: boolean = true
    ) {
        if ('BroadcastChannel' in self && pbUsingBroadCastChannel) {
            this._broadCast = new BroadcastChannel(pzChannelName);
            this._broadCast.onmessage = this.broadCastChanged.bind(this);
        } else {
            window.removeEventListener('storage', this._bindHandleStorage);
            window.addEventListener('storage', this._bindHandleStorage);
        }

        this._zChannelName = pzChannelName;
    }

    public dispose() {
        if (this._broadCast) {
            this._broadCast.close();
            this._broadCast = null;
        } else {
            window.removeEventListener('storage', this._bindHandleStorage);
        }

        if (this.onDataChanged) this.onDataChanged.removeAllHandlers();
    }

    public postMessage(pzMessage: any) {
        if (this._broadCast) {
            this._broadCast.postMessage(pzMessage);
        } else {
            localStorage.setItem(this.channelName, pzMessage);
            localStorage.removeItem(this.channelName);
        }
    }

    private broadCastChanged(e: MessageEvent) {
        if (e.data && e.data.windowGuid == window.name) return;

        const _e = new BroadCastEventArgs(e.data);
        this.onDataChanged.raise(this, _e);
    }

    private _bindHandleStorage = this.window_storage.bind(this);
    private window_storage(e: StorageEvent) {
        if (
            e.storageArea != localStorage ||
            String.isNullOrEmpty(e.key) ||
            String.isNullOrEmpty(this.channelName) ||
            String.compare(e.key, this.channelName) != 0
        )
            return;

        if (e.newValue == null) return;

        const _e = new BroadCastEventArgs(e.newValue);
        this.onDataChanged.raise(this, _e);
    }
}
