import * as wjc from '@grapecity/wijmo';
import { WebDataTable } from './bravo.web.datatable';
import { WebDataColumn } from './bravo.web.datacolumn';
import { ForeignKeyConstraint } from './bravo.web.foreignkeyconstraint';
import { WebDataSet } from './bravo.web.dataset';
import { DataKey } from './bravo.constraint';
import { UniqueConstraint } from './bravo.web.uniqueconstraint';
import { compareStrings } from '../bravo.core.function';

export class WebRelationCollection extends wjc.ObservableArray {
    get(key: any): WebRelation {
        let _index = this.internalIndexOf(key);
        return this[_index];
    }

    public add(relation: WebRelation): WebRelation;
    public add(relation: string, parentColumn: WebDataColumn[], childColumn: WebDataColumn[]): WebRelation;
    public add(relation: any, parentColumn?: WebDataColumn[], childColumn?: WebDataColumn[]): WebRelation {
        if (relation instanceof WebRelation) {
            this.addCore(relation);
            return relation;
        } else if (wjc.isString(relation)) {
            let _dataRelation = new WebRelation(relation, parentColumn, childColumn, true);
            this.add(_dataRelation);

            /*_dataRelation.setChildKeyConstraint(new ForeignKeyConstraint(relation, parentColumn, childColumn));

            if (!_dataRelation.childConstrainKey.canEnableConstraint())
                throw new Error(String.format(MessageContstants.DataConstraint_ParentValues));

            _dataRelation.parentTable.childRelations.add(_dataRelation);
            _dataRelation.childTable.parentRelations.add(_dataRelation); */

            return _dataRelation;
        }
    }

    public getDataSet(): WebDataSet {
        return null;
    }

    protected addCore(relation: WebRelation) {
        return null;
    }

    public contains(name: string) {
        return this.internalIndexOf(name) >= 0;
    }

    protected internalIndexOf(name: string) {
        // let _num = -1;
        if (name && 0 < name.length) {
            let _count = this.length;
            for (let _i = 0; _i < _count; _i++) {
                let _dataRelation = this[_i];
                if (compareStrings(name, _dataRelation.relationName, true)) return _i;

                // if (_num2 == -1) {
                //     _num = ((_num == -1) ? _i : -2);
                // }
            }
        }

        return -1;
    }

    public dispose() {
        for (let _i = 0; _i < this.length; _i++) {
            let _wr = this[_i];
            if (_wr instanceof WebRelation) {
                _wr.dispose();
                _wr = null;
            }
        }

        this.clear();
    }
}

export class WebTableRelationCollection extends WebRelationCollection {
    private readonly table: WebDataTable;
    private readonly relations: Array<WebRelation>;
    private bParentCollection: boolean;

    constructor(table: WebDataTable, bParentCollection: boolean) {
        super();

        if (table == null) {
            throw new Error();
        }

        this.table = table;
        this.relations = new Array<WebRelation>();
        this.bParentCollection = bParentCollection;
    }

    public addCore(relation: WebRelation) {
        super.addCore(relation);

        this.getDataSet().relations.add(relation);
        // this.addCache(relation);
    }

    private addCache(relation: WebRelation) {
        super.push(relation);
    }

    public getDataSet() {
        return this.table.dataSet;
    }

    public get(key: any): WebRelation {
        if (Number.isNumber(key)) {
            if (key >= 0 && key < this.length) {
                return <WebRelation>this[key];
            }
        } else if (wjc.isString(key)) {
            let _num = this.internalIndexOf(key);
            if (_num == -2) {
                throw new Error();
            }

            if (_num >= 0) {
                return <WebRelation>this[_num];
            }

            return null;
        }
    }

    public dispose() {
        super.dispose();

        if (this.relations) {
            for (let _i = this.relations.length - 1; _i >= 0; _i--) {
                const _r = this.relations[_i];
                if (_r instanceof WebRelation) _r.dispose();
            }

            this.relations.clear();
        }
    }
}

export class WebSetRelationCollection extends WebRelationCollection {
    private _dataSet: WebDataSet = null;

    constructor(dataSet: WebDataSet) {
        super();
        this._dataSet = dataSet;
    }

    public addCore(relation: WebRelation) {
        if (relation.childTable.dataSet != this._dataSet || relation.parentTable.dataSet != this._dataSet)
            throw new Error();

        super.push(relation);

        relation.parentTable.childRelations.push(relation);
        relation.childTable.parentRelations.push(relation);

        relation.setDataSet(this._dataSet);

        let foreignKey = relation.childTable.constraints.findForeignKeyConstraint(
            relation.parentColumns,
            relation.childColumns
        );
        if (relation.createConstraints) {
            if (foreignKey == null) {
                foreignKey = new ForeignKeyConstraint(null, relation.parentColumns, relation.childColumns);
                relation.childTable.constraints.add(foreignKey, true);

                try {
                    foreignKey.constraintName = relation.relationName;
                } catch (_ex) {
                    throw _ex;
                }
            }
        }

        const key = relation.parentTable.constraints.findKeyConstraint(relation.parentColumns);
        relation.setParentKeyConstraint(key);
        relation.setChildKeyConstraint(foreignKey);
    }

    public getDataSet() {
        return this._dataSet;
    }
}

export class WebRelation {
    private _relationName: string;
    private _parentKey: DataKey;
    private _childKey: DataKey;

    public createConstraints: boolean;

    get childKey(): DataKey {
        return this._childKey;
    }

    get parentKey(): DataKey {
        return this._parentKey;
    }

    get parentColumns(): Array<WebDataColumn> {
        return this._parentKey.toArray();
    }

    get childColumns(): Array<WebDataColumn> {
        return this._childKey.toArray();
    }

    get parentTable(): WebDataTable {
        return this._parentKey.table;
    }

    get childTable(): WebDataTable {
        return this._childKey.table;
    }

    get relationName(): string {
        return this._relationName;
    }

    private _parentConstrainKey: UniqueConstraint;

    public get parentConstrainKey(): UniqueConstraint {
        return this._parentConstrainKey;
    }

    private _childConstrainKey: ForeignKeyConstraint;

    public get childConstrainKey() {
        return this._childConstrainKey;
    }

    private _dataSet: WebDataSet;

    public get dataSet(): WebDataSet {
        return this._dataSet;
    }

    public setDataSet(dataSet: WebDataSet) {
        this._dataSet = dataSet;
    }

    setParentKeyConstraint(value: UniqueConstraint) {
        this._parentConstrainKey = value;
    }

    setChildKeyConstraint(value: ForeignKeyConstraint) {
        this._childConstrainKey = value;
    }

    constructor(
        relationName: string,
        parentColumns: Array<WebDataColumn>,
        childColumns: Array<WebDataColumn>,
        createConstraints: boolean = false
    ) {
        this.create(relationName, parentColumns, childColumns, createConstraints);
    }

    private create(
        relationName: string,
        parentColumns: Array<WebDataColumn>,
        childColumns: Array<WebDataColumn>,
        createConstraints: boolean
    ) {
        this._parentKey = new DataKey(parentColumns, true);
        this._childKey = new DataKey(childColumns, true);

        if (parentColumns.length != childColumns.length) {
            throw new Error();
        }

        this._relationName = !relationName ? '' : relationName;
        this.createConstraints = createConstraints;
    }

    public dispose() {
        if (this._childKey) {
            this._childKey.dispose();
            this._childKey = null;
        }

        if (this._parentKey) {
            this._parentKey.dispose();
            this._parentKey = null;
        }

        if (this._parentConstrainKey) {
            this._parentConstrainKey.dispose();
            this._parentConstrainKey = null;
        }

        if (this._childConstrainKey) {
            this._childConstrainKey.dispose();
            this._childConstrainKey = null;
        }

        if (this._dataSet) this._dataSet = null;
    }

    public implementsInterface(interfaceName: string) {
        return interfaceName == 'IWebRelation';
    }
}
