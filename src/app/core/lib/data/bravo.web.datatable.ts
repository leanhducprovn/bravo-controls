import { WebDataColumnCollection, DataColumnChangeEventArgs, WebDataColumn } from './bravo.web.datacolumn';
import { WebRelationCollection, WebTableRelationCollection, WebRelation } from './bravo.web.datarelation';
import { sameContent } from '../bravo.datatype.converter';
import { DataRowVersion, WebDataRow } from './bravo.web.datarow';
import { DataRowState, DataRowAction, MissingSchemaAction, DataViewRowState } from './enums';
import * as wjc from '@grapecity/wijmo';
import { ListChangedEventArgs, ListChangedType } from '../eventArgs/list.changed.eventArgs';
import { IBindingList } from '../interface/IBindingList';
import { WebDataSet } from './bravo.web.dataset';
import { ConstraintCollection } from './bravo.web.foreignkeyconstraint';
import { IWebDataTable } from '../interface/IWebDataTable';
import { EventEmitter } from '@angular/core';
import { ExtensionsMethod } from '../extensions.method';
import { DataEventArgs } from '../eventArgs/data.eventArgs';
import { buildSort, SortPattern } from './bravo.data.function';
import { compareStrings } from '../bravo.core.function';

export class WebDataTable extends wjc.CollectionView implements IBindingList, IWebDataTable {
    constructor(name?: string, sourceCollection?: any, options?) {
        super(sourceCollection, options);

        this._name = !String.isNullOrEmpty(name) ? name : 'Table1';
        this._constraintCollection = new ConstraintCollection();

        if (this._cols == null) this._cols = new WebDataColumnCollection(this);

        if (this._rows == null) this._rows = new Array<WebDataRow>();
    }

    public readonly refreshViewRelation = new wjc.Event();
    public onRefreshViewRelation() {
        this.refreshViewRelation.raise(this, wjc.EventArgs.empty);
    }

    public recordChanging = new wjc.Event();
    public onRecordChanging(e: DataEventArgs) {
        if (this.removing || this._committing) return;

        this.recordChanging.raise(this, e);
    }

    public recordChanged = new wjc.Event();
    public onRecordChanged() {
        if (this.removing || this._committing) return;

        this.recordChanged.raise(this);
    }

    public _defaultView: wjc.CollectionView;

    public get defaultView(): wjc.CollectionView {
        if (this._defaultView) return this._defaultView;

        return this;
    }

    /* private _lastDefaultView: any;

    public initDefaultView(view: any) {
        if (Object.is(this._defaultView, view))
            return;

        this._lastDefaultView = this._defaultView;
        this._defaultView = view;
    }

    public releaseDefaultView() {
        if (!Object.is(this._lastDefaultView, this._defaultView))
            this._defaultView = this._lastDefaultView;

        this._lastDefaultView = null;
    } */

    public readonly onCommitEdit = new wjc.Event();

    public readonly listChanged = new wjc.Event();
    public onListChanged(e: ListChangedEventArgs) {
        if (this.listChanged != null) this.listChanged.raise(this, e);
    }

    public readonly columnChanging = new wjc.Event();
    public onColumnChanging(e?: DataColumnChangeEventArgs) {
        this.columnChanging.raise(this, e);

        if (this._childRelationCollection && this.childRelations.length > 0) {
            for (let _i = 0; _i < this.childRelations.length; _i++) {
                let relation: WebRelation = wjc.tryCast(this.childRelations[_i], 'IWebRelation');
                if (relation && relation.childConstrainKey && relation.childConstrainKey.columns) {
                    relation.childConstrainKey.cascadeUpdate(e.Row, e.Col.columnName, e.ProposedValue);
                }
            }
        }
    }

    public readonly columnChanged = new wjc.Event();
    public onColumnChanged(e?: DataColumnChangeEventArgs) {
        this.columnChanged.raise(this, e);
    }

    public readonly rowChanging = new wjc.Event();
    public onRowChanging(args: DataRowChangeEventArgs, peRow: WebDataRow, peAction: DataRowAction) {
        if (args == null) args = new DataRowChangeEventArgs(peRow, peAction);

        this.rowChanging.raise(this, args);
        return args;
    }

    public readonly rowChanged = new wjc.Event();
    public onRowChanged(args: DataRowChangeEventArgs, peRow: WebDataRow, peAction: DataRowAction) {
        if (args == null) args = new DataRowChangeEventArgs(peRow, peAction);
        this.rowChanged.raise(this, args);
        return args;
    }

    public readonly rowDeleting = new wjc.Event();
    protected onRowDeleting(e: DataRowChangeEventArgs) {
        if (this._childRelationCollection && this.childRelations.length > 0) {
            for (let _i = 0; _i < this.childRelations.length; _i++) {
                let _rl: WebRelation = wjc.tryCast(this.childRelations[_i], 'IWebRelation');
                if (_rl && _rl.childConstrainKey && _rl.childConstrainKey.columns) {
                    _rl.childConstrainKey.cascadeUpdate(e.row);
                }
            }
        }

        this.rowDeleting.raise(this, e);
        return !e.cancel;
    }

    public readonly rowDeleted = new wjc.Event();
    protected onRowDeleted(e: DataRowChangeEventArgs) {
        this.rowDeleted.raise(this, e);
    }

    private _childRelationCollection: WebRelationCollection;
    public get childRelations(): WebRelationCollection {
        if (!this._childRelationCollection) {
            this._childRelationCollection = new WebTableRelationCollection(this, false);
        }

        return this._childRelationCollection;
    }

    private _parentRelationCollection: WebRelationCollection;
    public get parentRelations(): WebRelationCollection {
        if (!this._parentRelationCollection) {
            this._parentRelationCollection = new WebTableRelationCollection(this, true);
        }

        return this._parentRelationCollection;
    }

    public readonly currentChangedNg = new EventEmitter();

    private _dataSet: WebDataSet;

    public get dataSet(): WebDataSet {
        return this._dataSet;
    }

    public setDataSet(pDataSet: WebDataSet) {
        if (this._dataSet != pDataSet) this._dataSet = pDataSet;
    }

    private _constraintCollection: ConstraintCollection = null;

    public get constraints(): ConstraintCollection {
        return this._constraintCollection;
    }

    private _cols: WebDataColumnCollection;
    get columns(): WebDataColumnCollection {
        return this._cols;
    }

    private _rows: Array<WebDataRow>;
    public get rows(): Array<WebDataRow> {
        return this._rows;
    }

    public get row(): WebDataRow {
        if (this.currentPosition == -1 || !this._rows) return null;
        return this.rows.find((row) => row.item == this.currentItem);
    }

    private _primaryKey: Array<WebDataColumn> = null;
    public get primaryKey(): Array<WebDataColumn> {
        if (this._primaryKey == null) this._primaryKey = new Array();

        return this._primaryKey;
    }

    public set primaryKey(value: Array<WebDataColumn>) {
        this._primaryKey = value;
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }

    public set name(val: string) {
        this._name = val;
    }

    private _displayExpression: string;

    public get displayExpression(): string {
        return this._displayExpression;
    }

    public set displayExpression(value: string) {
        this._displayExpression = value;
    }

    //@ts-ignore
    public get currentEditItem() {
        return this._edtItem || {};
    }

    public set currentEditItem(value: any) {
        let _item = value,
            _content = sameContent(_item, this._edtClone);

        if (_content && !_content.flag && !String.isNullOrEmpty(_content.key) && this.currentPosition != -1) {
            const _col = this.columns.get(_content.key);
            const _row: WebDataRow = this.row;

            this._edtClone = {};
            this._extend(this._edtClone, this._edtItem);

            let _e = new DataColumnChangeEventArgs(_row, _col, _content.value);
            this.onColumnChanging(_e);
            if (_e.cancel) {
                this.cancelEdit();
                return;
            }

            if (_item[_content.key] != _e.ProposedValue) {
                _item[_content.key] = _e.ProposedValue;
                if (this._edtClone) this._edtClone[_content.key] = _e.ProposedValue;
            }

            const _nCol = this.columns.getIndex(_content.key);
            if (_row.rowState != DataRowState.Added) {
                if (_row.rowState == DataRowState.Unchanged) _row.originalItems = [..._row.currentItems];

                _row.currentItems[_nCol] = _e.ProposedValue;
            } else {
                if (_row.currentItems == null) _row.currentItems = new Array(this.columns.count);

                _row.currentItems[_nCol] = _e.ProposedValue;
            }

            _e = new DataColumnChangeEventArgs(_row, _col, _e.ProposedValue, _item);
            this.onColumnChanged(_e);
        }
    }

    private _extendedProperties: Map<string, any> = null;

    public get extendedProperties(): Map<string, any> {
        if (!this._extendedProperties) this._extendedProperties = new Map<string, any>();

        return this._extendedProperties;
    }

    private _viewSort: string;

    public get viewSort(): string {
        return this._viewSort;
    }

    public set viewSort(value: string) {
        if (this._viewSort == value) return;
        this._viewSort = value;
        buildSort(this, value);
    }

    public get hasErrors(): boolean {
        for (let _i = 0; this._rows && _i < this.rows.length; _i++) {
            if (this.rows[_i].hasErrors) return true;
        }

        return false;
    }

    public addNew() {
        let _item = super.addNew();

        const _row = this.rows.find((row) => row.item == _item);
        if (_row == null) return super.addNew();

        /* const _args = new DataRowChangeEventArgs(_row, DataRowAction.Add);
        this.onRowChanging(_args, _row, DataRowAction.Add);
        if (_args.cancel) {
            this.cancelNew();
            return;
        }

        if (_row.rowState != DataRowState.Added)
            _row.rowState = DataRowState.Added;

        this.onRowChanged(_args, _row, DataRowAction.Add); */

        return _item;
    }

    public newRow(): WebDataRow {
        let _newItem = this.addNew();
        if (this.sourceCollection == null) return null;

        let _i = this.sourceCollection.indexOf(_newItem);
        if (_i >= 0 && _i < this.sourceCollection.length) {
            return this.rows.find((row) => row.item == _newItem);
        }
    }

    public newRow0(item?: any) {
        if (item == null) item = {};

        let _row = new WebDataRow(this, item);
        let _parentRelation = this.parentRelations.get(this.name);

        for (const _col of this.columns) {
            if (_col instanceof WebDataColumn) {
                if (_col.autoIncrement)
                    item[_col.columnName] = this.rows.length * _col.autoIncrementSeed + _col.autoIncrementStep;
                else if (_col.defaultValue != null) item[_col.columnName] = _col.defaultValue;

                if (
                    _parentRelation &&
                    _parentRelation.childColumns.includes(_col) &&
                    _parentRelation.parentTable.items.length > 0
                ) {
                    let _item = _parentRelation.parentTable.currentItem;
                    if (!_item) _item = _parentRelation.parentTable.items[0];

                    if (_item) {
                        const _index = _parentRelation.childColumns.indexOf(_col);
                        const _zParentKey = _parentRelation.parentColumns[_index].columnName;
                        item[_col.columnName] = _item[_zParentKey];
                    }
                }

                _row.currentItems.push(item[_col.columnName]);
            }
        }

        _row.rowState = DataRowState.Detached;
        return _row;
    }

    public select(
        filterExpression?: string,
        sort?: string,
        recordStates: DataViewRowState = DataViewRowState.None
    ): Array<WebDataRow> {
        if (this.rows == null || this.rows.length < 1) return new Array();
        let _rows = this.rows.clone();

        if (!String.isNullOrEmpty(sort)) {
            let _exprs = sort.split(',');

            for (const _zOrder of _exprs) {
                if (String.isNullOrEmpty(_zOrder)) continue;

                let _m = _zOrder.match(SortPattern);
                let _zColName = String.isNullOrEmpty(_m[1]) ? _m[2] : _m[1];

                if (!this.columns.contains(_zColName)) continue;

                _rows = _rows.sort((a, b) => ExtensionsMethod.sortBy(_zColName, a, b, _zOrder.includes('DESC')));
            }
        }

        if (recordStates == DataViewRowState.None) return _rows;

        return _rows.reduce((items, row) => {
            if (!items.includes(row)) {
                if (
                    (recordStates & DataViewRowState.CurrentRows) == DataViewRowState.CurrentRows &&
                    (row.rowState == DataRowState.Added ||
                        row.rowState == DataRowState.Unchanged ||
                        row.rowState == DataRowState.Modified)
                )
                    items.push(row);
                else if (
                    (recordStates & DataViewRowState.ModifiedCurrent) == DataViewRowState.ModifiedCurrent &&
                    row.rowState == DataRowState.Modified &&
                    row.hasVersion(DataRowVersion.Current)
                )
                    items.push(row);
                else if (
                    (recordStates & DataViewRowState.ModifiedOriginal) == DataViewRowState.ModifiedOriginal &&
                    row.rowState == DataRowState.Modified &&
                    row.hasVersion(DataRowVersion.Original)
                )
                    items.push(row);
                else if (
                    (recordStates & DataViewRowState.Added) == DataViewRowState.Added &&
                    row.rowState == DataRowState.Added
                )
                    items.push(row);
                else if (
                    (recordStates & DataViewRowState.Deleted) == DataViewRowState.Deleted &&
                    row.rowState == DataRowState.Deleted
                )
                    items.push(row);
                else if (
                    (recordStates & DataViewRowState.OriginalRows) == DataViewRowState.OriginalRows &&
                    (row.rowState == DataRowState.Unchanged || row.rowState == DataRowState.Deleted)
                )
                    items.push(row);
                else if (
                    (recordStates & DataViewRowState.Unchanged) == DataViewRowState.Unchanged &&
                    row.rowState == DataRowState.Unchanged
                )
                    items.push(row);
            }

            return items;
        }, []);
    }

    public find(...keys: Array<any>) {
        if (this.primaryKey == null || this.primaryKey.length < 1) return;

        if (this.primaryKey.length != keys.length) return;

        const _item = this.primaryKey.reduce((o, k, i) => ({ ...o, [k.columnName]: keys[i] }), {});
        const _zKey = JSON.stringify(_item);
        for (let _nRow = 0; _nRow < this.rows.length; _nRow++) {
            const _row = this.rows[_nRow];
            if (_row == null || _row.rowState == DataRowState.Deleted || _row.rowState == DataRowState.Detached)
                continue;

            const _key = WebDataTable._getKey(this.primaryKey, _row.item);
            if (compareStrings(_zKey, _key, true)) return _row;
        }
    }

    public endEdit(item: any) {
        let _row: WebDataRow = null;
        if (item instanceof WebDataRow) _row = item;
        else _row = this.rows.find((row) => row.item == item);

        if (_row == null) return;

        const _item = _row.item;
        if (this.sourceCollection instanceof Array && this.sourceCollection.indexOf(_item) < 0) {
            if (this.sourceCollection instanceof wjc.ObservableArray) this.sourceCollection.beginUpdate();

            try {
                this.sourceCollection.push(_item);
            } finally {
                if (this.sourceCollection instanceof wjc.ObservableArray) this.sourceCollection.endUpdate();
            }
        }

        if (this.rows.indexOf(_row) < 0) this.rows.push(_row);

        const _args = new DataRowChangeEventArgs(_row, DataRowAction.Add);
        this.onRowChanging(_args, _row, DataRowAction.Add);
        if (_args.cancel) {
            this.cancelNew();
            return;
        }

        if (_row.rowState != DataRowState.Added) _row.rowState = DataRowState.Added;

        if (this.isAddingNew) this.commitNew();

        this.onRowChanged(_args, _row, DataRowAction.Add);
    }

    public commitEdit(column?: any) {
        if (!String.isNullOrEmpty(column)) {
            const _bdl = wjc.tryCast(this.defaultView, 'IBindingList');
            if (_bdl)
                _bdl.onListChanged(
                    new ListChangedEventArgs(
                        ListChangedType.ItemChanged,
                        this.defaultView.currentPosition,
                        this.defaultView.currentPosition,
                        column
                    )
                );

            if (this.defaultView.isEditingItem) {
                const _nCol = this.columns.getIndex(column);
                const _row = this.rows.find((row) => row.item == this.defaultView._edtItem);
                if (_row && _nCol >= 0 && _nCol < this.columns.length) {
                    if (_row.rowState == DataRowState.Unchanged) {
                        _row.setModified();
                        this.onRowChanged(null, _row, DataRowAction.Change);
                    }
                }
            }

            return;
        }

        super.commitEdit();
    }

    public commitNew() {
        if (this.isAddingNew)
            this.onListChanged(new ListChangedEventArgs(ListChangedType.ItemAdded, this.currentPosition, -1));

        super.commitNew();
    }

    public cancelNew() {
        const item = this._newItem;
        if (item != null) {
            const _rowIndex = this.rows.findIndex((row) => row.item == item);
            if (_rowIndex >= 0 && _rowIndex < this.rows.length) this.rows.splice(_rowIndex, 1);
        }

        super.cancelNew();
    }

    public acceptChanges(): void {
        let _array = this.rows.clone();
        for (let _i = 0; _i < _array.length; _i++) {
            if (_array[_i]) _array[_i].acceptChanges();
        }

        this._newItem = null;
        this._edtItem = null;
    }

    public commitRow(pRow: WebDataRow) {
        let args = this.onRowChanging(null, pRow, DataRowAction.Commit);
        this.onRowChanged(args, pRow, DataRowAction.Commit);
    }

    public newItemCreator = () => {
        const _item = {};
        for (const _col of this.columns) _item[_col.columnName] = _col.defaultValue;

        return _item;
    };

    removing: boolean = false;

    public remove(item: any) {
        // const _e = new DataEventArgs(item);
        // this.onRecordChanging(_e);

        this.removing = true;
        try {
            if (item != null) {
                let _row = this.rows.find((_r) => _r.item == item);
                if (_row) {
                    const _e = new DataRowChangeEventArgs(_row, DataRowAction.Delete);
                    if (this.onRowDeleting(_e)) {
                        if (_row.rowState == DataRowState.Added) {
                            _row.rowState = DataRowState.Detached;
                        } else {
                            _row.rowState = DataRowState.Deleted;
                            if (_row.originalItems.length <= 0) _row.originalItems = [..._row.currentItems];
                        }

                        this.onRowDeleted(_e);
                    }
                }
            }

            if (this.defaultView == this) super.remove(item);
            else this.defaultView.remove(item);
        } finally {
            this.removing = false;
            // this.onRecordChanged();
        }
    }

    public getErrors(): Array<WebDataRow> {
        let _rowsErrors = new Array<WebDataRow>();
        for (let _i = 0; _i < this.rows.length; _i++) {
            if (this.rows[_i].hasErrors) _rowsErrors.push(this.rows[_i]);
        }

        return _rowsErrors;
    }

    public clone() {
        let _tb = new WebDataTable(this.name);
        _tb._cols = new WebDataColumnCollection(_tb);

        for (const _col of this.columns) {
            let _colCopy = _tb._cols.add(new WebDataColumn(_col.columnName, _col.dataType));
            if (_col.autoIncrement) {
                _colCopy.autoIncrement = _col.autoIncrement;
                _colCopy.autoIncrementSeed = _col.autoIncrementSeed;
                _colCopy.autoIncrementStep = _col.autoIncrementStep;
            }
        }

        if (this.extendedProperties.size > 0) {
            this.extendedProperties.forEach((value, key) => {
                if (!_tb.extendedProperties.has(key)) _tb.extendedProperties.set(key, value);
            });
        }

        return _tb;
    }

    public dispose() {
        this.clear();

        if (this._cols) this._cols.dispose();

        if (this._rows) this._rows.length = 0;

        if (this._pgView) this._pgView.length = 0;

        if (this._src) this._src.length = 0;

        if (this._childRelationCollection) this._childRelationCollection.dispose();

        if (this._parentRelationCollection) this._parentRelationCollection.dispose();

        if (this._extendedProperties) {
            this._extendedProperties.clear();
            this._extendedProperties = null;
        }

        for (const prop in this) {
            try {
                const evt = this[prop];
                if (evt instanceof wjc.Event) {
                    evt.removeAllHandlers();
                }
            } catch {}
        }

        this.currentChangedNg.unsubscribe();
    }

    public onCurrentChanged(e?: wjc.EventArgs) {
        super.onCurrentChanged(e);

        if (this.currentChangedNg) this.currentChangedNg.emit(e);

        if (!this.isUpdating && this.childRelations && this.childRelations.length > 0) {
            for (let _i = 0; _i < this.childRelations.length; _i++) {
                const _relation: WebRelation = wjc.tryCast(this.childRelations[_i], 'IWebRelation');
                if (!_relation || !_relation.childKey) continue;
                _relation.childTable.refresh();
            }
        }
    }

    public moveCurrentToPosition(index: number) {
        const _nOldPos = this._idx;
        const _rs = super.moveCurrentToPosition(index);

        if (index >= -1 && index < this._pgView.length && index != _nOldPos) {
            const _e = new ListChangedEventArgs(ListChangedType.ItemMoved, index, _nOldPos);
            this.onListChanged(_e);
        }

        return _rs;
    }

    public loadDataRow(item: any, pbAcceptChanges: boolean) {
        this._mergeRow(item);

        if (pbAcceptChanges) this.acceptChanges();
    }

    public merge(
        pTable: WebDataTable | Array<any>,
        preserveChanges: boolean = false,
        missingSchemaAction: MissingSchemaAction = MissingSchemaAction.Add
    ) {
        if (pTable instanceof Array) {
            this._mergeArray(pTable, preserveChanges, missingSchemaAction);
            return;
        }

        if (missingSchemaAction == MissingSchemaAction.AddWithKey) {
            for (const _col of pTable.columns) {
                this.mergeColumn(this.columns, _col);
            }
        }

        if (!pTable || pTable.itemCount <= 0) return;

        try {
            for (const _row of pTable.rows) {
                if (_row && (_row.rowState == DataRowState.Deleted || _row.rowState == DataRowState.Detached)) continue;

                this._mergeRow(_row, preserveChanges);
            }
        } catch (_ex) {
            console.error(_ex);
        }
    }

    private mergeColumn(columns: WebDataColumnCollection, pColumn: WebDataColumn) {
        let _col: WebDataColumn = columns.get(pColumn.columnName);
        if (!_col) _col = this.columns.add(pColumn.columnName, pColumn.dataType);

        _col.defaultValue = pColumn.defaultValue;
        _col.allowDBNull = pColumn.allowDBNull;
        _col.autoIncrement = pColumn.autoIncrement;
        _col.autoIncrementSeed = pColumn.autoIncrementSeed;
        _col.autoIncrementStep = pColumn.autoIncrementStep;
        _col.caption = pColumn.caption;
        _col.maxLength = pColumn.maxLength;
        _col.readOnly = pColumn.readOnly;
        _col.setUnique(pColumn.unique);

        if (_col.unique && pColumn.table.primaryKey.includes(pColumn)) {
            if (_col.table.primaryKey && !_col.table.primaryKey.includes(_col)) _col.table.primaryKey.push(_col);
            else if (!_col.table.primaryKey) _col.table.primaryKey = [_col];
        }
    }

    public mergeRows(
        rows: Array<WebDataRow>,
        preserveChanges: boolean = false,
        missingSchemaAction: MissingSchemaAction = MissingSchemaAction.Add
    ) {
        if (rows.length < 1) return;

        if (missingSchemaAction == MissingSchemaAction.AddWithKey) {
            let _tb = rows[0].table;
            for (const _col of _tb.columns) {
                this.mergeColumn(this.columns, _col);
            }
        }

        for (const _row of rows) {
            if (String.compare(_row.table.name, this.name) != 0) continue;

            this._mergeRow(_row, preserveChanges);
        }
    }

    public getGroupKeys(pzGroupName: string, pGroups: wjc.CollectionViewGroup[]): Array<any> {
        if (
            pGroups.length == 0 ||
            this.groupDescriptions.findIndex(
                (gp) => gp instanceof wjc.PropertyGroupDescription && gp.propertyName == pzGroupName
            ) == -1
        )
            return;

        let _lst = new Array<any>();
        for (const clg of pGroups) {
            if (clg.groupDescription['propertyName'] == pzGroupName) _lst.push(clg.name);
            else if (clg.groups && clg.groups.length > 0) _lst.push(...this.getGroupKeys(pzGroupName, clg.groups));
        }

        return _lst;
    }

    private _mergeArray(
        pData: Array<any>,
        preserveChanges: boolean = false,
        missingSchemaAction: MissingSchemaAction = MissingSchemaAction.Add
    ) {
        if (missingSchemaAction == MissingSchemaAction.Add || missingSchemaAction == MissingSchemaAction.AddWithKey) {
            const _item = pData[0];
            if (_item) {
                for (const _zColName in _item) {
                    if (!this.columns.contains(_zColName)) this.columns.add(_zColName);
                }
            }
        }

        for (let _i = 0; _i < pData.length; _i++) {
            const _item = pData[_i];
            this._mergeRow(_item, preserveChanges);
        }
    }

    private _mergeRow(dataItem, preserveChanges: boolean = false) {
        let _item = dataItem,
            _rowState = DataRowState.Added;

        let _bAllowEdit: boolean = true;

        if (dataItem instanceof WebDataRow) {
            _item = dataItem.item;
            _rowState = dataItem.rowState;

            for (const _c of this.primaryKey) {
                if (!dataItem.table.columns.contains(_c.columnName)) {
                    _bAllowEdit = false;
                    break;
                }
            }
        } else {
            _bAllowEdit = false;
        }

        let _items = [...this._src];
        let _n = 0;

        if (_bAllowEdit && (_n = WebDataTable.findIndexByPrimaryKey(this, _items, _item)) >= 0) {
            let _currentItem = this._src[_n];
            this.editItem(_currentItem);

            for (let _key in _item) {
                if (!this.columns.contains(_key) || this.columns.get(_key).readOnly) continue;

                this.currentEditItem[_key] = _item[_key];
            }

            if (preserveChanges) this.commitEdit();
        } else {
            this._addRow(_item, preserveChanges, _rowState);

            if (preserveChanges) {
                this.commitEdit();
                this.commitNew();
            }
        }
    }

    private _addRow(pItem, preserveChanges: boolean = false, rowState: DataRowState = DataRowState.Added) {
        // this.commitEdit();
        if (preserveChanges) this.commitNew();

        try {
            // honor canAddNew
            if (!this.canAddNew) {
                return null;
            }

            // create new item
            let item = null,
                src = this.sourceCollection;
            if (this.newItemCreator) {
                item = this.newItemCreator();
            } else if (src && src.length) {
                item = new src[0].constructor();
            } else {
                item = {};
            }

            if (item != null) {
                for (const key in pItem) {
                    const _zKey = ExtensionsMethod.containsProperty(item, key);
                    if (item.hasOwnProperty(_zKey) && pItem.hasOwnProperty(key)) item[_zKey] = pItem[key];
                }

                if (Object.keys(item).length == 0) item = pItem;

                // remember the new item
                this._newItem = item;

                let _row = new WebDataRow(this, item);

                // add the new item to the collection
                this._updating++;
                this._src.push(item); // **

                const _index = this.rows.push(_row);
                for (const _col of this.columns) {
                    if (_col instanceof WebDataColumn) {
                        if (item[_col.columnName] == null) {
                            if (preserveChanges && _col.autoIncrement)
                                item[_col.columnName] = _index * _col.autoIncrementSeed + _col.autoIncrementStep;

                            if (item[_col.columnName] == null) item[_col.columnName] = _col.defaultValue;
                        }

                        _row.currentItems.push(item[_col.columnName]);
                    }
                }

                this._updating--;

                // add the new item to the bottom of the current view
                if (this._pgView != this._src) {
                    this._pgView.push(item);
                }

                // add the new item to the last group and to the data items
                if (this.groups && this.groups.length) {
                    let g = this.groups[this.groups.length - 1];
                    g.items.push(item);
                    while (g.groups && g.groups.length) {
                        g = g.groups[g.groups.length - 1];
                        g.items.push(item);
                    }
                }

                if (preserveChanges) {
                    if (item) this.moveCurrentTo(item);

                    const _args = new DataRowChangeEventArgs(_row, DataRowAction.Add);
                    this.onRowChanging(_args, _row, DataRowAction.Add);
                    if (_args.cancel) {
                        this.cancelNew();
                        return;
                    }

                    if (_row.rowState != rowState) _row.rowState = rowState;

                    this.onRowChanged(_args, _row, DataRowAction.Add);
                } else {
                    if (_row.rowState != rowState) _row.rowState = rowState;
                }

                return _row;
            }
        } finally {
        }
    }

    public copy() {
        let _tb = new WebDataTable(this.name);
        for (const _col of this.columns) {
            const _colCopy = _tb.columns.add(_col.columnName, _col.dataType);
            _colCopy.defaultValue = _col.defaultValue;
            _colCopy.allowDBNull = _col.allowDBNull;
            _colCopy.autoIncrement = _col.autoIncrement;
            _colCopy.autoIncrementSeed = _col.autoIncrementSeed;
            _colCopy.autoIncrementStep = _col.autoIncrementStep;
            _colCopy.caption = _col.caption;
            _colCopy.maxLength = _col.maxLength;
            _colCopy.readOnly = _col.readOnly;
            _colCopy.setUnique(_col.unique);
        }

        if (this.rows instanceof Array) {
            _tb.deferUpdate(() => {
                for (const _row of this.rows) {
                    const _rowCopy = _tb._addRow(_row.item, true);
                    _tb.commitNew();

                    if (_rowCopy) {
                        _rowCopy.rowState = _row.rowState;
                        _rowCopy.originalItems = _row.originalItems;
                    }
                }
            });
        }

        if (this.extendedProperties.size > 0) {
            this.extendedProperties.forEach((value, key) => {
                if (!_tb.extendedProperties.has(key)) _tb.extendedProperties.set(key, value);
            });
        }

        // if (this.constraints) {
        //     for (const constraint of this.constraints) {
        //         _tb.constraints.add(constraint);
        //     }
        // }

        if (this.primaryKey) {
            for (const primaryKey of this.primaryKey) {
                let _col = _tb.columns.get(primaryKey.columnName);
                if (_col) _tb.primaryKey.push(_col);
            }
        }

        return _tb;
    }

    public clear() {
        this.clearChanges();

        if (this._src != null) this._src.clear();

        if (this._rows) this._rows.clear();

        if (this._pgView) this._pgView.clear();

        this._idx = -1;
        this._newItem = null;
        this._edtItem = null;

        this.onListChanged(new ListChangedEventArgs(ListChangedType.Reset, -1, -1));
    }

    public onCollectionChanged(e = wjc.NotifyCollectionChangedEventArgs.reset) {
        if (this.sourceCollection && this.sourceCollection.length > 0) {
            if (this._cols == null) this._cols = new WebDataColumnCollection(this);

            if (e instanceof wjc.NotifyCollectionChangedEventArgs) {
                this.handleCollectionChanged(this.sourceCollection, e);
            }
        }

        super.onCollectionChanged(e);
    }

    public handleCollectionChanged(pSource: Array<any>, e: wjc.NotifyCollectionChangedEventArgs) {
        switch (e.action) {
            case wjc.NotifyCollectionChangedAction.Add: {
                if (e.item == null) break;

                let _row = new WebDataRow(this, e.item);
                let _parentRelation = this.parentRelations.get(this.name);

                for (const _col of this.columns) {
                    if (_col instanceof WebDataColumn) {
                        if (_col.autoIncrement)
                            e.item[_col.columnName] =
                                this.rows.length * _col.autoIncrementSeed + _col.autoIncrementStep;

                        if (
                            _parentRelation &&
                            _parentRelation.childColumns.includes(_col) &&
                            _parentRelation.parentTable.items.length > 0
                        ) {
                            let _item = _parentRelation.parentTable.currentItem;
                            if (!_item) _item = _parentRelation.parentTable.items[0];

                            if (_item) {
                                const _index = _parentRelation.childColumns.indexOf(_col);
                                const _zParentKey = _parentRelation.parentColumns[_index].columnName;
                                e.item[_col.columnName] = _item[_zParentKey];
                            }
                        }

                        _row.currentItems.push(e.item[_col.columnName]);
                    }
                }

                _row.rowState = DataRowState.Detached;
                this.rows.push(_row);

                break;
            }
            case wjc.NotifyCollectionChangedAction.Change: {
                if (e.index < 0) break;

                let _row = this.rows.find((row) => row.item == e.item);
                if (_row) {
                    if (_row.rowState == DataRowState.Unchanged) {
                        _row.setModified();
                        this.onRowChanged(null, _row, DataRowAction.Change);
                    }

                    if (_row.rowState == DataRowState.Modified)
                        for (let _nCol = 0; _nCol < this.columns.count; _nCol++) {
                            let _col = this.columns[_nCol];
                            _row.currentItems[_nCol] = e.item[_col.columnName];
                        }
                }
                break;
            }
        }
    }

    public refreshBindingData() {
        for (const _row of this.rows) {
            if (_row == null) continue;
            for (let _nCol = 0; _nCol < this.columns.count; _nCol++) {
                const _col: WebDataColumn = this.columns[_nCol];
                try {
                    if (_row.item[_col.columnName] !== _row.currentItems[_nCol])
                        _row.item[_col.columnName] = _row.currentItems[_nCol];
                } catch {}
            }
        }
    }

    implementsInterface(interfaceName: string) {
        if (interfaceName == 'IBindingList' || interfaceName == 'IWebDataTable') return true;

        return super.implementsInterface(interfaceName);
    }

    getCollection() {
        return this;
    }

    _bOverideCreateGroup: boolean = false;

    _createGroups(items) {
        let _root: Array<wjc.CollectionViewGroup> = null;

        if (!this._grpDesc || this._grpDesc.length == 0) return null;

        if (!this._bOverideCreateGroup || this._grpDesc.length > 1) {
            _root = super._createGroups(items);
            return _root;
        }

        let _lastGroup: wjc.CollectionViewGroup = null;

        if (_root == null) _root = new Array();

        for (let _i = 0; _i < items.length; _i++) {
            let _item = items[_i],
                _groups = _root,
                _levels = this._grpDesc.length;

            let path = '';
            for (let _level = 0; _level < _levels; _level++) {
                let _gd = this._grpDesc[_level],
                    _name = _gd.groupNameFromItem(_item, _level),
                    _last = _level == _levels - 1;

                let _group = this.getGroup(_gd, _groups, _name, _level, _last, _lastGroup);

                // keep group path (all names in the hierarchy)
                path += '/' + _name;
                _group._path = path;

                // add data items to last level groups
                if (_last) {
                    _group.items.push(_item);
                }

                // move on to the next group
                _groups = _group.groups;

                _lastGroup = _group;
            }
        }

        return _root;
    }

    private getGroup(
        gd: wjc.GroupDescription,
        groups: wjc.CollectionViewGroup[],
        name: string,
        level: number,
        isBottomLevel: boolean,
        lastGroup: wjc.CollectionViewGroup
    ) {
        let _g: wjc.CollectionViewGroup = null;

        // if (lastGroup && level == lastGroup.level) {
        //     for (let i = 0; i < groups.length; i++) {
        //         if (gd.namesMatch(groups[i].name, name)) {
        //             return groups[i];
        //         }
        //     }
        // }

        if (lastGroup == null || this._compareValue(lastGroup.name, name) != 0) {
            _g = new wjc.CollectionViewGroup(gd, name, level, isBottomLevel);
            groups.push(_g);
        }

        return _g != null ? _g : lastGroup;
    }

    private _compareValue(val0: any, val1: any) {
        if (Date.isDate(val0) || Date.isDate(val1) || Number.isNumber(val0) || Number.isNumber(val1))
            return Object.compare(val0, val1);

        return String.compare(val0, val1);
    }

    _compareItems() {
        if (this._srtCmp == null) this._srtCmp = this._sortCmp.bind(this);

        return super._compareItems();
    }

    private _sortCmp(v1, v2) {
        if (v1 != null && v2 == null) return +1;
        if (v1 == null && v2 != null) return -1;

        return null;
    }

    public writeJson() {
        if (this.columns.length < 1 || this.rows.length < 1 || this.items.length < 1) return null;

        let _array = new Array();
        for (const _item of this.items) {
            _array.push(_item);
        }

        return JSON.stringify(_array);
    }

    public static findIndexByPrimaryKey(pTable: WebDataTable, collection: Array<any>, item: any) {
        if (pTable.primaryKey.length <= 0 || collection.length <= 0 || item == null) return -2;

        let _keyDst = {};
        for (const _col of pTable.primaryKey) {
            _keyDst[_col.columnName] = item[_col.columnName];
        }

        let _zKeyDst = JSON.stringify(_keyDst);
        let _nIndex = -1;
        for (let _n = 0; _n < collection.length; _n++) {
            let _item = collection[_n],
                _keySrc = {};

            for (let _col of pTable.primaryKey) _keySrc[_col.columnName] = _item[_col.columnName];

            if (_zKeyDst == JSON.stringify(_keySrc)) {
                _nIndex = _n;
                break;
            }
        }

        return _nIndex;
    }

    private static _getKey(columns: Array<WebDataColumn>, item: any) {
        const _keyDst = {};
        const _nLen = columns.length;

        let _zColName: string;
        for (let _i = 0; _i < _nLen; _i++) {
            _zColName = columns[_i].columnName;
            _keyDst[_zColName] = item[_zColName];
        }

        return JSON.stringify(_keyDst);
    }
}

export class WebTableCollection extends wjc.ObservableArray {
    private _dataSet: WebDataSet = null;

    constructor(dataSet: WebDataSet) {
        super();

        this._dataSet = dataSet;
    }

    public add(table?: any) {
        let _tb: WebDataTable;
        if (table == null) _tb = new WebDataTable();
        else if (wjc.isString(table)) _tb = new WebDataTable(table);
        else _tb = table;

        let _index = this.findIndex((x) => x.name == _tb.name);
        if (_index != -1) this.removeAt(_index);

        this.push(_tb);
        _tb.setDataSet(this._dataSet);

        return _tb;
    }

    public contains(pzTableName: string): boolean {
        return this.find((t) => compareStrings(t.name, pzTableName, true)) ? true : false;
    }

    public get(pzTableName: string): WebDataTable {
        return this.find((t) => compareStrings(t.name, pzTableName, true));
    }
}

export class DataRowChangeEventArgs extends wjc.CancelEventArgs {
    public readonly row: WebDataRow;
    public readonly action: DataRowAction;

    constructor(row: WebDataRow, action: DataRowAction) {
        super();
        this.row = row;
        this.action = action;
    }
}
