import { WebDataColumn } from "./bravo.web.datacolumn";

export class WebDataError {
    private _zRowError = String.empty;

    public get text(): string {
        return this._zRowError;
    }

    public set text(value: string) {
        this.setText(value);
    }

    private _errorList: Array<ColumnError>;

    private get errorList(): Array<ColumnError> {
        if (!this._errorList)
            this._errorList = new Array<ColumnError>();

        return this._errorList;
    }

    public get count(): number {
        if (!this._errorList) return 0;
        return this._errorList.length;
    }

    public get hasErrors(): boolean {
        if (this._zRowError.length == 0)
            return this.count != 0;

        return true;
    }

    constructor(pzRowError?: string) {
        if (pzRowError)
            this.setText(pzRowError);
    }

    public setColumnError(pColumn: WebDataColumn, pzError: string) {
        if (!pzError || pzError.length == 0) {
            this.clear(pColumn);
        }
        else {
            let _error: ColumnError;
            let _i = this.indexOf(pColumn);
            if (_i == -1) {
                _error = new ColumnError();
                this.errorList.push(_error);
            }
            else {
                _error = this.errorList[_i];
            }

            _error.column = pColumn;
            _error.error = pzError;

            pColumn.errors++;
        }
    }

    public getColumnError(pColumn: WebDataColumn) {
        for (let _i = 0; _i < this.count; _i++) {
            if (this.errorList[_i].column == pColumn)
                return this.errorList[_i].error;
        }

        return String.empty;
    }

    public getColumnsInError(): Array<WebDataColumn> {
        let _array = new Array(this.count);
        for (let _i = 0; _i < this.count; _i++) {
            _array[_i] = this.errorList[_i].column;
        }
        return _array;
    }

    public clear(pColumn?: WebDataColumn) {
        if (this.count != 0) {
            for (let _i = 0; _i < this.count; _i++) {
                if (!pColumn || this.errorList[_i].column == pColumn) {
                    this.errorList[_i].column.errors--;
                    this.errorList.splice(_i, 1);
                }
            }

            // this.errorList.clear();
            this._zRowError = String.empty;
        }
    }

    private indexOf(pColumn: WebDataColumn) {
        for (let i = 0; i < this.count; i++) {
            if (this.errorList[i].column == pColumn) {
                return i;
            }
        }

        return -1;
    }

    private setText(pzError: string) {
        if (!pzError)
            pzError = String.empty;

        this._zRowError = pzError;
    }
}

class ColumnError {
    public column: WebDataColumn;
    public error: string;
}
