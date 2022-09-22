import { WebDataColumn } from './bravo.web.datacolumn';
import { WebDataTable } from './bravo.web.datatable';
import { Resources } from '../resources';

export class Constraint {
    dispose() {
    }

    protected _inCollection: boolean = false;

    public get inCollection(): boolean {
        return this._inCollection;
    }

    public set inCollection(value: boolean) {
        this._inCollection = value;
    }
}

const maxColumns: number = 32;
export class DataKey {
    constructor(columns: Array<WebDataColumn>, copyColumns: any) {
        if (!columns) {
            throw new Error(String.format(Resources.ArgumentNullError, "columns"));
        }

        if (columns.length == 0 || columns.length > maxColumns) {
            throw new Error();
        }

        if (copyColumns) {
            this.columns = new Array<WebDataColumn>(columns.length);
            for (let n = 0; n < columns.length; n++) {
                this.columns[n] = columns[n];
            }
        }
        else {
            this.columns = columns;
        }
    }

    private readonly columns: Array<WebDataColumn>;

    public get columnsReference(): Array<WebDataColumn> {
        return this.columns;
    }

    get table(): WebDataTable {
        return this.columns[0].table;
    }

    columnsEqual(key: DataKey) {
        return DataKey.columnsEqual(this.columns, key.columns);
    }

    private static columnsEqual(column1: WebDataColumn[], column2: WebDataColumn[]) {
        if (column1 === column2) {
            return true;
        }
        else if (!column1 || !column2) {
            return false;
        }
        else if (column1.length != column2.length) {
            return false;
        }
        else {
            for (let _n1 = 0; _n1 < column1.length; _n1++) {
                let bCheck = false;
                for (let _n2 = 0; _n2 < column2.length; _n2++) {
                    if (column1[_n1] != column2[_n2]) {
                        bCheck = true;
                        break;
                    }
                }

                if (bCheck) {
                    return false;
                }
            }

            return true;
        }
    }

    getColumnNames(): Array<string> {
        let values = new Array<string>(this.columns.length);
        for (let n = 0; n < this.columns.length; n++) {
            values[n] = this.columns[n].columnName;
        }

        return values;
    }

    toArray(): Array<WebDataColumn> {
        let values = new Array<WebDataColumn>(this.columns.length);
        for (let n = 0; n < this.columns.length; n++) {
            values[n] = this.columns[n];
        }

        return values;
    }

    dispose() {
        if (this.columns) {
            this.columns.clear();
        }
    }
}