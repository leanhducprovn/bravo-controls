import { EventArgs } from '@grapecity/wijmo';

export class BroadCastEventArgs extends EventArgs {
    public readonly data: any;

    constructor(data: any) {
        super();
        this.data = data;
    }
}
