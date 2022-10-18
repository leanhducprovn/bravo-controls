import { DataRowState, DataViewRowState, TypeCode } from './enums';
import { WebDataTable } from './bravo.web.datatable';
import * as wjc from '@grapecity/wijmo';
import { WebDataColumn, WebDataColumnCollection } from './bravo.web.datacolumn';
import { WebDataError } from './bravo.web.dataerror';
import { BravoDataTypeConverter } from '../bravo.datatype.converter';
import { WebRelation } from './bravo.web.datarelation';
import { getKeyValues, arraysIdentical } from './bravo.web.data.helper';
import { IWebDataRow } from '../interface/IWebDataRow';
import { ListChangedEventArgs, ListChangedType } from '../eventArgs/list.changed.eventArgs';
import { DataEventArgs } from '../eventArgs/data.eventArgs';
import { setCurrentEditItem } from './bravo.data.function';

export class WebDataRow implements IWebDataRow {
    public readonly item: any = null;

    constructor(table: WebDataTable, item?: any) {
        this._table = table;
        this._columns = table.columns;

        if (table.columns.length < 1 && item) {
            for (const key in item) {
                table.columns.add(key);
            }
        }

        if (item) this.item = item;
    }

    private readonly _columns: WebDataColumnCollection;

    private _rowState: DataRowState = DataRowState.Unchanged;

    public get rowState(): DataRowState {
        return this._rowState;
    }

    public set rowState(state: DataRowState) {
        this._rowState = state;
    }

    private _error: WebDataError;

    public get hasErrors(): boolean {
        return this._error ? this._error.hasErrors : false;
    }

    private _table: WebDataTable = null;

    public get table(): WebDataTable {
        return this._table;
    }

    private _currentItems: Array<any> = null;

    public get currentItems(): Array<any> {
        if (!this._currentItems) this._currentItems = new Array<any>();

        return this._currentItems;
    }

    public set currentItems(value: Array<any>) {
        this._currentItems = value;
    }

    private _originalItems: Array<any> = null;

    public get originalItems(): Array<any> {
        if (!this._originalItems) this._originalItems = new Array<any>();

        return this._originalItems;
    }

    public set originalItems(value: Array<any>) {
        this._originalItems = value;
    }

    public get defaultItems(): Array<any> {
        if (!this._columns || this._columns.count < 1) return;

        let _defaultItems = new Array<any>();

        for (let _col of this._columns) _defaultItems.push(_col.defaultValue);

        return _defaultItems;
    }

    private _rowError: string;

    public get rowError(): string {
        return this._rowError;
    }

    public set rowError(value: string) {
        this._rowError = value;
    }

    public endEdit(column?: any) {
        // const _e = new DataEventArgs(this.item);
        // this.table.onRecordChanging(_e);

        try {
            this.table.onCommitEdit.raise(this, new DataEventArgs(column));
            this.table.commitEdit(column);
        } finally {
            // this.table.onRecordChanged();
        }
    }

    public getParentRow(
        pRelation: WebRelation,
        pVersion: DataRowVersion = DataRowVersion.Current
    ): WebDataRow {
        let _parentTable = pRelation.parentTable;
        if (_parentTable) {
            let _rows = _parentTable.select(null, null, DataViewRowState.CurrentRows);
            if (_rows instanceof Array) {
                let _row,
                    _parentKey,
                    _childKey = getKeyValues(pRelation.childKey, this, pVersion);

                for (_row of _rows) {
                    _parentKey = getKeyValues(pRelation.parentKey, _row, pVersion);
                    if (arraysIdentical(_childKey, _parentKey)) break;
                }

                if (_row) return _row;
            }

            return _parentTable.row;
        }
    }

    public getChildRowsByRelationName(pzRelationName: string) {
        if (this.table.childRelations == null || this.table.childRelations.length < 1) return;

        let _relation = this.table.childRelations.find(
            (re) => re instanceof WebRelation && re.childTable.name == pzRelationName
        );

        return this.getChildRows(_relation);
    }

    public getChildRows(
        pRelation: WebRelation,
        pVersion: DataRowVersion = DataRowVersion.Current
    ): WebDataRow[] {
        let _childTable = pRelation.childTable;
        let _rs = new Array<WebDataRow>();
        if (_childTable) {
            let _rows = _childTable.select(null, null, DataViewRowState.CurrentRows),
                _parentKey = getKeyValues(pRelation.parentKey, this, pVersion);

            for (const _row of _rows) {
                if (_row.rowState == DataRowState.Deleted || _row.rowState == DataRowState.Detached)
                    continue;

                const _childKey = getKeyValues(pRelation.childKey, _row, pVersion);
                if (arraysIdentical(_parentKey, _childKey)) _rs.push(_row);
            }
        }

        return _rs;
    }

    public getValue(key: any, pVersion: DataRowVersion = DataRowVersion.Current) {
        if (wjc.isString(key)) key = this._columns.getIndex(key);
        else if (key instanceof WebDataColumn) key = this._columns.indexOf(key);

        let _col: WebDataColumn = this._columns[key],
            _type = _col ? _col.dataType : TypeCode.String,
            _value;

        if (key >= 0 && key < this._columns.count) {
            if (pVersion == DataRowVersion.Current) _value = this.currentItems[key];
            else if (pVersion == DataRowVersion.Original) _value = this.originalItems[key];
            else if (pVersion == DataRowVersion.Default)
                _value = this.defaultItems[key] || this.currentItems[key];
        }

        return !wjc.isUndefined(_value) ? BravoDataTypeConverter.convertValue(_value, _type) : null;
    }

    public isNull(column, pVersion: DataRowVersion = DataRowVersion.Current) {
        return this.getValue(column, pVersion) != null ? false : true;
    }

    public delete() {
        if (this.rowState != DataRowState.Deleted) {
            if (this.item) {
                if (this.table._src && this.table._src.includes(this.item)) {
                    let _nIndex = this.table._src.indexOf(this.item);

                    // let _lastItem = this.table.currentItem;
                    if (this.table.currentPosition != _nIndex) this.table.currentPosition = _nIndex;

                    try {
                        this.table.onListChanged(
                            new ListChangedEventArgs(ListChangedType.ItemDeleted, _nIndex)
                        );
                        this.table.remove(this.item);
                    } finally {
                        // if (this.table.currentItem != _lastItem)
                        //     this.table.moveCurrentTo(_lastItem)
                    }
                }
            }

            if (this._originalItems == null || this.originalItems.length <= 0)
                this.originalItems = [...this.currentItems];
        }
    }

    public setAdded() {
        if (this.rowState == DataRowState.Unchanged) {
            this.rowState = DataRowState.Added;

            if (this._originalItems != null) this._originalItems = null;
        }
    }

    public setModified() {
        if (this.rowState == DataRowState.Unchanged) {
            this.rowState = DataRowState.Modified;

            if (this._originalItems == null || this.originalItems.length <= 0)
                this.originalItems = [...this.currentItems];
        }
    }

    public setValue(key: any, value: any) {
        let _nIndex: number = -1,
            _zColumnName: string = null;

        if (wjc.isString(key)) {
            _nIndex = this._columns.getIndex(key);
            _zColumnName = key;
        } else if (wjc.isNumber(key) && key >= 0 && key < this._columns.count) {
            _nIndex = key;
            _zColumnName = this._columns[key].columnName;
        }

        if (_nIndex >= 0 && _nIndex < this._columns.count) {
            let _currentItem = this.item;

            const _cv = this.table.defaultView;
            const _bLastUpdating = _cv.isUpdating;
            if (!_bLastUpdating) _cv.beginUpdate();

            try {
                if (_currentItem != null) {
                    try {
                        if (_cv.currentPosition != _cv._pgView.indexOf(_currentItem))
                            _cv.moveCurrentTo(_currentItem);

                        _cv.editItem(_currentItem);
                        _currentItem[_zColumnName] = value;

                        setCurrentEditItem(_cv, this, _currentItem);
                    } finally {
                        if (_cv.currentPosition == -1) _cv.moveCurrentTo(_currentItem);
                    }
                }
            } finally {
                if (!_bLastUpdating) _cv.endUpdate();
            }
        }
    }

    public hasVersion(pVersion: DataRowVersion): boolean {
        switch (pVersion) {
            case DataRowVersion.Original:
                if (this._originalItems != null && this._originalItems.length > 0) return true;

                break;
            case DataRowVersion.Current:
                if (this._currentItems != null && this._currentItems.length > 0) return true;

                break;
            case DataRowVersion.Default:
                if (this.defaultItems != null && this.defaultItems.length > 0) return true;

                break;
        }

        return false;
    }

    public setColumnError(columnIndex: number, pzError: string);
    public setColumnError(columnName: string, pzError: string);
    public setColumnError(column: WebDataColumn, pzError: string);
    public setColumnError(pColumn: any, pzError: string) {
        if (Number.isNumber(pColumn)) pColumn = this._columns[pColumn];
        else if (wjc.isString(pColumn)) pColumn = this._columns.get(pColumn);

        if (pColumn instanceof WebDataColumn) {
            if (!this._error) this._error = new WebDataError();

            if (this.getColumnError(pColumn) != pzError)
                this._error.setColumnError(pColumn, pzError);
        }
    }

    public getColumnError(columnIndex: number);
    public getColumnError(columnIndex: string);
    public getColumnError(column: WebDataColumn);
    public getColumnError(pColumn: any): string {
        if (Number.isNumber(pColumn)) pColumn = this._columns[pColumn];
        else if (wjc.isString(pColumn)) pColumn = this._columns.get(pColumn);

        if (pColumn instanceof WebDataColumn) {
            if (!this._error) this._error = new WebDataError();

            return this._error.getColumnError(pColumn);
        }

        return String.empty;
    }

    public clearError(column?: WebDataColumn) {
        if (this._error) this._error.clear(column);
    }

    public clearErrors() {
        if (!this._columns || this._columns.length < 1) return;

        for (const _col of this._columns) {
            this.clearError(_col);
        }
    }

    public getColumnsInError(): Array<WebDataColumn> {
        if (this._error) return this._error.getColumnsInError();
    }

    public acceptChanges(): void {
        if (
            this.rowState != DataRowState.Detached &&
            this.rowState != DataRowState.Deleted &&
            this._columns.count > 0
        ) {
            for (let _i = 0; _i < this._columns.count; _i++) {
                this.originalItems[_i] = this.currentItems[_i];
            }

            this.rowState = DataRowState.Unchanged;
        }

        this._table.commitRow(this);
    }

    public implementsInterface(interfaceName: string) {
        if (interfaceName == 'IWebDataRow') return true;
    }
}

export enum DataRowVersion {
    Original = 256,
    Current = 512,
    Proposed = 1024,
    Default = 1536
}
