import { WebDataColumn } from "./bravo.web.datacolumn";
import { Constraint, DataKey } from './bravo.constraint';

export class UniqueConstraint extends Constraint {
    private _bPrimaryKey = false;

    public get bPrimaryKey(): boolean {
        return this._bPrimaryKey;
    }

    private _key: DataKey;

    public get key(): DataKey {
        return this._key;
    }

    public constraintName: string = null;
    public columnNames: Array<string> = null;

    constructor(name: string, isPrimaryKey: boolean = false, ...columns: Array<WebDataColumn>) {
        super();
        this._bPrimaryKey = isPrimaryKey;

        if (String.isNullOrEmpty(name) && columns.length > 0)
            name = String.format('IX_{0}_{1}', columns[0].table.name, columns[0].columnName);

        this.create(name, ...columns);
    }

    public create(constraintName: string, ...columns: Array<WebDataColumn>) {
        this._key = new DataKey([...columns], true);
        this.constraintName = constraintName;

        // if (columns.length == 1)
        //     columns[0].setUnique(true);

        // for (const _col of columns) {
        //     if (_col) _col.setUnique(true, true);
        // }

        this.checkUniqueByContraint(columns);
    }

    private checkUniqueByContraint(pColumns: Array<WebDataColumn>) {
        if (!pColumns || pColumns.length < 1) return false;

        const _seen = new Set();
        const _tb = pColumns[0].table;

        if (!_tb || _tb.isUpdating) return false;

        const _nLen = _tb.sourceCollection.length;
        for (let _i = 0; _i < _nLen; _i++) {
            const _val = UniqueConstraint._getKey(pColumns, _tb.sourceCollection[_i]);
            if (_seen.has(_val))
                throw new Error(String.format("UniqueConstraint contains non-unique values {0}",
                    _tb.name));

            _seen.add(_val);
        }
    }

    public get columns(): Array<WebDataColumn> {
        return this.key.toArray();
    }

    public dispose() {
        if (this._key)
            this._key.dispose();

        super.dispose();
    }

    public get inCollection(): boolean {
        return this._inCollection;
    }

    public set inCollection(v: boolean) {
        this._inCollection = v;

        if (this._key.columnsReference.length == 1)
            this._key.columnsReference[0].setUnique(v);
    }

    private static _getKey(columns: Array<WebDataColumn>, item: any) {
        const _keyDst = {};
        const _nLen = columns.length;

        let _zColName: string;
        for (let _i = 0; _i < _nLen; _i++) {
            _zColName = columns[_i].columnName;
            _keyDst[_zColName] = item[_zColName]
        }

        return JSON.stringify(_keyDst);
    }
}