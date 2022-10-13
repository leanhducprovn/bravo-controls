import { EventArgs } from '@grapecity/wijmo';

export class DataEventArgs extends EventArgs {
    public readonly data: any;

    constructor(data: any) {
        super();

        this.data = data;
    }
}
