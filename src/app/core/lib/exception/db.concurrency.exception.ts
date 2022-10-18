import { WebDataRow } from '../data/bravo.web.datarow';

export class DBConcurrencyException extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'DBConcurrencyException';

        const actualProto = new.target.prototype;

        Object.setPrototypeOf(this, DBConcurrencyException.prototype);
    }

    private _dataRows: Array<WebDataRow>;

    public setRows(pRows: Array<WebDataRow>) {
        this._dataRows = pRows;
    }

    public get rowCount(): number {
        return this._dataRows ? this._dataRows.length : 0;
    }

    public get row(): WebDataRow {
        return this._dataRows && this._dataRows.length > 0 ? this._dataRows[0] : null;
    }

    public set row(value: WebDataRow) {
        this._dataRows = [value];
    }

    public copyToRows(array: Array<WebDataRow>, pnIndex: number = 0) {
        let dataRows = this._dataRows;
        if (null != dataRows) {
            array.push(...dataRows.splice(pnIndex));
        }
    }
}
