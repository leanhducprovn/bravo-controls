import { CancelEventArgs } from "@grapecity/wijmo";

export class DataValueChangeEventArgs extends CancelEventArgs {
    public readonly columnName: string;

    public readonly value: any;

    constructor(pzColumnName: string, pValue?: any) {
        super();
        this.columnName = pzColumnName;
        this.value = pValue;
    }
}