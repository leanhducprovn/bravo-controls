import { WebDataTable } from "./bravo.web.datatable";
import { getType } from "../bravo.datatype.converter";
import { TypeCode } from "./enums";
import * as wjc from "@grapecity/wijmo";
import { WebDataRow } from "./bravo.web.datarow";
import { UniqueConstraint } from './bravo.web.uniqueconstraint';
import { compareStrings } from "../bravo.core.function";

export class WebDataColumn {
    private _table: WebDataTable;

    public get table(): WebDataTable {
        return this._table;
    };

    columnName: string;

    private _dataType: TypeCode;

    public get dataType(): TypeCode {
        return this._dataType;
    }

    public set dataType(value: TypeCode) {
        this._dataType = value;
    }

    maxLength: number;
    defaultValue: any;
    errors: number = 0;

    private _ordinal: number = 0;

    public get ordinal(): number {
        return this._ordinal;
    }

    private _autoIncrement: boolean = false;

    public get autoIncrement(): boolean {
        return this._autoIncrement;
    }

    public set autoIncrement(value: boolean) {
        this._autoIncrement = value;
    }

    // public autoIncrement: boolean = false;

    private _autoIncrementSeed: number = 0;

    public get autoIncrementSeed(): number {
        return this._autoIncrementSeed;
    }

    public set autoIncrementSeed(value: number) {
        this._autoIncrementSeed = value;
    }

    private _autoIncrementStep: number = 1;

    public get autoIncrementStep(): number {
        return this._autoIncrementStep;
    }

    public set autoIncrementStep(value: number) {
        this._autoIncrementStep = value;
    }

    private _bAllowDBNull = true;

    public get allowDBNull(): boolean {
        return this._bAllowDBNull;
    }

    public set allowDBNull(value: boolean) {
        this._bAllowDBNull = value;
    }

    private _caption: string = null;

    public get caption(): string {
        return this._caption;
    }

    public set caption(value: string) {
        this._caption = value;
    }

    private _readOnly = false;

    public get readOnly(): boolean {
        return this._readOnly;
    }

    public set readOnly(value: boolean) {
        this._readOnly = value;
    }

    private _unique: boolean = false;

    public get unique(): boolean {
        return this._unique;
    }

    public set unique(value: boolean) {
        if (this._unique == value)
            return;

        this._unique = value;

        if (this.table) {
            if (value) {
                const _zName = String.format('IX_{0}_{1}', this.table.name, this.columnName);
                if (!this.table.constraints.findKeyConstraint([this])) {
                    let _cs = new UniqueConstraint(_zName, false, this);
                    this.table.constraints.add(_cs);
                }
            }
            else {
                // this.table.remove
            }
        }
    }

    public setUnique(value, pbManualCheck: boolean = false) {
        this._unique = value;

        if (this._unique && !pbManualCheck)
            this.checkUnique();
    }

    private checkUnique() {
        if (!this.table || !this.table.sourceCollection ||
            !this.table.columns.contains(this.columnName))
            return;

        const _seen = new Set();
        const _nLen = this.table.sourceCollection.length;
        for (let _i = 0; _i < _nLen; _i++) {
            const _val = this.table.sourceCollection[_i][this.columnName];
            if (_seen.has(_val))
                throw new Error(String.format("Column '{0}' contains non-unique values {1}",
                    this.columnName, this.table.name));

            _seen.add(_val);
        }
    }

    private _expression: string;

    public get expression(): string {
        return this._expression;
    }

    public set expression(value: string) {
        this._expression = value;
    }

    private _extendedProperties: Map<string, any> = null;

    public get extendedProperties(): Map<string, any> {
        if (!this._extendedProperties)
            this._extendedProperties = new Map<string, any>();

        return this._extendedProperties;
    }

    constructor(name: string, type?: TypeCode) {
        this.columnName = name;
        this.dataType = type || TypeCode.String;
    }

    public setTable(table: WebDataTable) {
        if (this._table != table) {
            this._table = table;
        }
    }

    public setOrdinal(pos: number) {
        this._ordinal = pos;
    }

    public dispose() {
        if (this._table)
            this._table = null;

        if (this._extendedProperties) {
            this._extendedProperties.clear();
            this._extendedProperties = null;
        }
    }
}

export class WebDataColumnCollection extends wjc.ObservableArray {
    constructor(table: WebDataTable) {
        super();

        this._table = table;

        if (table && table.items && table.items.length > 0) {
            let _item = table.items[0];
            let _type: TypeCode, _val: any, _col: WebDataColumn;

            for (let key in _item) {
                _val = _item[key];
                _type = getType(_val);

                _col = new WebDataColumn(key, _type);
                _col.setTable(table);

                if (!this.includes(_col))
                    this.push(_col);
            }
        }
    }

    public contains(name: string): boolean {
        if (this.find(col => compareStrings(col.columnName, name, true)))
            return true;

        return false;
    }

    private _bUsingExpression: boolean = false;

    public get bUsingExpression(): boolean {
        return this._bUsingExpression;
    }

    public add(column: WebDataColumn): WebDataColumn;
    public add(column: string): WebDataColumn;
    public add(column: string, type: number, expression?: string): WebDataColumn;
    public add(column: any, type?: number, expression?: string): WebDataColumn {
        let _column: WebDataColumn;
        if (column instanceof WebDataColumn) {
            this.push(column);
            _column = column;
        }
        else if (typeof column === 'string') {
            let _dataColumn = new WebDataColumn(column);
            _column = this.add(_dataColumn);
        }

        if (type != null) _column.dataType = type;
        _column.setTable(this._table);

        if (expression) {
            _column.expression = expression;
            if (!this._bUsingExpression)
                this._bUsingExpression = true;
        }

        return _column;
    }

    public remove(column: any) {
        let _index = this.getIndex(column);
        if (_index >= 0) {
            this.removeAt(_index);
            return true;
        }

        return super.remove(column);
    }

    public get(columnName: string): WebDataColumn {
        return this.find(col => compareStrings(col.columnName, columnName, true));
    }

    public getIndex(columnName: string): number {
        return this.findIndex(col => compareStrings(col.columnName, columnName, true));
    }

    public get count(): number {
        return this.length;
    }

    private _table: WebDataTable;

    public dispose() {
        if (this._table)
            this._table = null;

        for (let _i = this.length - 1; _i >= 0; _i--) {
            let _col = this[_i];
            if (_col instanceof WebDataColumn) {
                _col.dispose();
                _col = null;
            }
        }

        this.clear();
    }
}

export class DataColumnChangeEventArgs {
    constructor(row: WebDataRow, col: WebDataColumn, value: any, item?: any, cancel: boolean = false) {
        this._row = row;
        this._col = col;
        this._proposedValue = value;
        this._cancel = cancel;
        this._item = item;
    }

    private _item: any;

    public get Item(): any {
        return this._item;
    }


    private _col: WebDataColumn;
    get Col(): WebDataColumn {
        return this._col;
    }

    private _row: WebDataRow;
    get Row(): WebDataRow {
        return this._row;
    }

    private _proposedValue: any;
    public get ProposedValue(): any {
        return this._proposedValue;
    }

    public set ProposedValue(value) {
        this._proposedValue = value;
    }

    private _cancel: any;
    public get cancel(): boolean {
        return this._cancel;
    }

    public set cancel(val: boolean) {
        this._cancel = val;
    }
}