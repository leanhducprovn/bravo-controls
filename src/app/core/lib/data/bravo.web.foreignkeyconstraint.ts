import { WebDataColumn } from './bravo.web.datacolumn';
import { WebDataTable } from './bravo.web.datatable';
import { Rule } from './enums';

import * as wjc from '@grapecity/wijmo';
import { UniqueConstraint } from './bravo.web.uniqueconstraint';
import { Constraint, DataKey } from './bravo.constraint';
import { getKeyValues, arraysIdentical } from './bravo.web.data.helper';
import { WebDataRow } from './bravo.web.datarow';

export class ForeignKeyConstraint extends Constraint {
    private _parentKey: DataKey;
    private _childKey: DataKey;
    private _updateRule: Rule;
    private _deleteRule: Rule;

    private _name: string;

    public get constraintName(): string {
        return this._name;
    }

    public set constraintName(value: string) {
        if (value == null) value = '';

        this._name = value;
    }

    get childKey(): DataKey {
        return this._childKey;
    }

    get columns(): WebDataColumn[] {
        return this._childKey.toArray();
    }

    get table(): WebDataTable {
        return this._childKey.table;
    }

    get childColumnsName(): string[] {
        return this._childKey.getColumnNames();
    }

    get parentKey(): DataKey {
        return this._parentKey;
    }

    get relatedColumns(): WebDataColumn[] {
        return this._parentKey.toArray();
    }

    get relatedTable(): WebDataTable {
        return this._parentKey.table;
    }

    get updateRule(): Rule {
        return this._updateRule;
    }

    set updateRule(value) {
        this._updateRule = value;
    }

    get deleteRule(): Rule {
        return this._deleteRule;
    }

    set deleteRule(value) {
        this._deleteRule = value;
    }

    constructor(name: any, parentColumns: WebDataColumn[], childColumns: WebDataColumn[]) {
        super();
        this.create(name, parentColumns, childColumns);
    }

    create(name: string, parentColumns: WebDataColumn[], childColumns: WebDataColumn[]): any {
        if (parentColumns.length != 0 && childColumns.length != 0) {
            if (parentColumns.length != childColumns.length) {
                throw new Error();
            }

            this._parentKey = new DataKey(parentColumns, true);
            this._childKey = new DataKey(childColumns, true);
            this.constraintName = name;
        }
    }

    canEnableConstraint() {
        let childArray = this.childKey.table.items.map((x) => x['id']),
            parentArray = this.parentKey.table.items.map((x) => x['Id']);
        let uniqueValues = childArray.filter((v, i, a) => a.indexOf(v) === i),
            uniqueValues2 = parentArray.filter((v, i, a) => a.indexOf(v) === i);

        for (var i = 0; i < uniqueValues.length; i++) {
            if (!uniqueValues2.includes(uniqueValues[i])) {
                return false;
            }
        }

        return true;
    }

    cascadeUpdate(row: WebDataRow, col?: string, value?: any) {
        switch (this.updateRule) {
            case Rule.None:
                break;
            case Rule.Cascade:
                let _rows = this.table.rows;
                let _keyValues = getKeyValues(this.parentKey, row);

                let _bRefresh: boolean = false;

                if (col) {
                    let _index = this.parentKey.columnsReference.findIndex(
                        (_col) => _col.columnName == col
                    );
                    if (_index >= 0) {
                        for (const _row of _rows) {
                            let _keyChildValues = getKeyValues(this.childKey, _row);
                            if (!arraysIdentical(_keyValues, _keyChildValues)) continue;

                            let _childCol = this.childKey.columnsReference[_index];
                            if (!_childCol) continue;

                            _row.setValue(_childCol.columnName, value);
                            _bRefresh = true;
                        }
                    }
                } else {
                    for (const _row of _rows) {
                        let _keyChildValues = getKeyValues(this.childKey, _row);

                        if (!arraysIdentical(_keyValues, _keyChildValues)) continue;

                        _row.delete();
                        _bRefresh = true;
                    }
                }

                if (_bRefresh) {
                    this.table.commitEdit();
                    this.table.refresh();
                }

                break;
        }
    }

    /* private getKeyValues(key: DataKey, val: any) {
        let _cols = key.toArray();
        let array = new Array(_cols.length);

        _cols.forEach((col, i) => {
            array[i] = val[col.columnName];
        });

        return array;
    } */

    checkConstraint(row: any, action: wjc.NotifyCollectionChangedAction) {
        if (action != wjc.NotifyCollectionChangedAction.Change) {
            return true;
        }

        let _keyValues = getKeyValues(this.childKey, row);
        let _rows = this.relatedTable.sourceCollection;

        if (_rows) {
            for (let key in _rows) {
                let _key = getKeyValues(this.parentKey, _rows[key]);
                if (!arraysIdentical(_keyValues, _key)) {
                    return false;
                }
            }
        }

        /* _rows.forEach((row, i) => {
            let _key = this.getKeyValues(this.parentKey, row);
            if (!arraysIdentical(_keyValues, _key)) {
                return false;
            }
        }); */

        return true;
    }

    hasKeyChanged(row: number, key: DataKey) {}

    // handler ForeignKeyConstraint
    getParentRow(parentKey: DataKey, childKey: DataKey, row: any) {
        let _keyValues: Array<any> = new Array<any>();
        childKey.getColumnNames().forEach((col) => {
            _keyValues.push(row[col]);
        });

        //this.relatedTable.items.
    }

    dispose() {
        if (this._childKey) this._childKey.dispose();

        if (this._parentKey) this._parentKey.dispose();

        super.dispose();
    }
}

export class ConstraintCollection extends wjc.ObservableArray {
    private defaultNameIndex = 0;

    constructor() {
        super();
    }

    add(constraint: Constraint, addUniqueWhenAddingForeign?: boolean) {
        if (constraint instanceof ForeignKeyConstraint) {
            if (addUniqueWhenAddingForeign) {
                let _key = constraint.relatedTable.constraints.findKeyConstraint(
                    constraint.relatedColumns
                );
                if (!_key) {
                    if (!constraint.constraintName) constraint.constraintName = this.assignName();
                    else {
                    }

                    _key = new UniqueConstraint(null, false, ...constraint.relatedColumns);
                    constraint.relatedTable.constraints.add(_key);
                }
            }
        }

        constraint.inCollection = true;
        this.push(constraint);
    }

    private assignName() {
        let newName = this.makeName(this.defaultNameIndex);
        this.defaultNameIndex++;
        return newName;
    }

    private makeName(index: number) {
        if (1 == index) {
            return 'Constraint1';
        }
        return 'Constraint' + index.toString();
    }

    findKeyConstraint(columns: Array<WebDataColumn>) {
        let constraintCount = this.length;
        for (let _i = 0; _i < constraintCount; _i++) {
            const constraint: UniqueConstraint =
                this[_i] instanceof UniqueConstraint ? this[_i] : null;
            if (constraint && arraysIdentical(constraint.key.columnsReference, columns))
                return constraint;
        }

        return null;
    }

    findForeignKeyConstraint(
        parentColumns: Array<WebDataColumn>,
        childColumns: Array<WebDataColumn>
    ) {
        let constraintCount = this.length;
        for (let _i = 0; _i < constraintCount; _i++) {
            const constraint: ForeignKeyConstraint =
                this[_i] instanceof ForeignKeyConstraint ? this[_i] : null;
            if (
                constraint &&
                arraysIdentical(constraint.parentKey.columnsReference, parentColumns) &&
                arraysIdentical(constraint.childKey.columnsReference, childColumns)
            )
                return constraint;
        }

        return null;
    }

    dispose() {
        for (let _i = 0; _i < this.length; _i++) {
            let _ct = this[_i];
            if (_ct instanceof Constraint) {
                _ct.dispose();
                _ct = null;
            }
        }
    }
}
