import * as wjc from '@grapecity/wijmo';
import { sameContent } from '../bravo.datatype.converter';
import { DataEventArgs } from '../eventArgs/data.eventArgs';
import { ListChangedEventArgs, ListChangedType } from '../eventArgs/list.changed.eventArgs';
import { IBindingList } from '../interface/IBindingList';
import { buildSort } from './bravo.data.function';
import { DataColumnChangeEventArgs } from './bravo.web.datacolumn';
import { WebRelation } from './bravo.web.datarelation';
import { WebDataRowView } from './bravo.web.datarowview';
import { WebDataTable } from './bravo.web.datatable';
import { DataRowState } from './enums';

export class WebDataView extends wjc.CollectionView implements IBindingList {
    //#region static method

    private static filterWithRelation(item: any, item1: any, expr: Map<string, string>) {
        if (!item || !item1) return false;

        const _keys = Array.from(expr.keys());
        for (const _zKey of _keys) {
            const _zChildKey = _zKey;
            const _zParentKey = expr.get(_zKey);
            if (item[_zChildKey] != item1[_zParentKey]) return false;
        }

        return true;
    }

    //#endregion static method

    public readonly listChanged = new wjc.Event();
    public onListChanged(e: ListChangedEventArgs) {
        if (this.listChanged != null) this.listChanged.raise(this, e);
    }

    getCollection(): wjc.ICollectionView {
        return this;
    }

    private _table: WebDataTable;

    public get table(): WebDataTable {
        return this._table;
    }

    private _rowFilter: string = null;

    public get rowFilter(): string {
        return this._rowFilter;
    }

    public set rowFilter(value: string) {
        if (String.compare(this._rowFilter, value) == 0) return;

        this._rowFilter = value;

        if (String.isNullOrEmpty(this._rowFilter)) this._filter = null;
    }

    //@ts-ignore
    public get currentEditItem() {
        return this._edtItem || {};
    }

    public set currentEditItem(value: any) {
        if (!this.isEditingItem) return;

        const _tb = this.table;
        if (!_tb) return;

        let _item = value,
            _content = sameContent(_item, this._edtClone);

        if (
            _content &&
            !_content.flag &&
            !String.isNullOrEmpty(_content.key) &&
            this.currentPosition != -1
        ) {
            const _col = _tb.columns.get(_content.key);
            const _row = _tb.rows.find((r) => Object.is(r.item, this.currentItem));

            this._edtClone = {};
            this._extend(this._edtClone, this._edtItem);

            let _e = new DataColumnChangeEventArgs(_row, _col, _content.value);
            _tb.onColumnChanging(_e);
            if (_e.cancel) {
                this.cancelEdit();
                return;
            }

            if (_item[_content.key] != _e.ProposedValue) {
                _item[_content.key] = _e.ProposedValue;
                if (this._edtClone) this._edtClone[_content.key] = _e.ProposedValue;
            }

            const _nCol = _tb.columns.getIndex(_content.key);
            if (_row.rowState != DataRowState.Added) {
                if (_row.rowState == DataRowState.Unchanged)
                    _row.originalItems = [..._row.currentItems];

                _row.currentItems[_nCol] = _e.ProposedValue;
            } else {
                if (_row.currentItems == null) _row.currentItems = new Array(_tb.columns.count);

                _row.currentItems[_nCol] = _e.ProposedValue;
            }

            _e = new DataColumnChangeEventArgs(_row, _col, _e.ProposedValue, _item);
            _tb.onColumnChanged(_e);
        }
    }

    private _sort: string;

    public get sort(): string {
        return this._sort;
    }

    public set sort(value: string) {
        if (this._sort == value) return;
        this._sort = value;
        buildSort(this, value);
    }

    constructor(sourceCollection?: any, options?: any) {
        super(null, options);

        let _src: any;
        if (sourceCollection instanceof WebDataTable) {
            this._table = sourceCollection;

            this._table.refreshViewRelation.addHandler(this.table_refreshViewRelation, this);
            /* this._table.collectionChanged.addHandler((s, e: wjc.NotifyCollectionChangedEventArgs) => {
                super.onCollectionChanged(e);
            }) */

            this._table.onCommitEdit.addHandler((s, e: DataEventArgs) => {
                if (e.data != null) {
                    this.onListChanged(
                        new ListChangedEventArgs(
                            ListChangedType.ItemChanged,
                            this.currentPosition,
                            this.currentPosition,
                            e.data
                        )
                    );
                }
            });

            this._table.currentChanged.addHandler((s, e) => {
                if (this._table.isUpdating || this.isUpdating) return;

                const _idx = this.items.indexOf(this.table.currentItem);
                if (_idx >= 0 && _idx != this._idx) {
                    this.moveCurrentToPosition(_idx);
                }
            });

            _src = sourceCollection.sourceCollection;
            this._idx = sourceCollection.currentPosition;
        } else {
            _src = sourceCollection;
        }

        this.sourceCollection = _src ? _src : new wjc.ObservableArray();
    }

    private table_refreshViewRelation() {
        if (this.table) {
            if (this.isAddingNew) this.commitNew();

            if (this.isEditingItem) this.commitEdit();

            this.refresh();
        }
    }

    public commitNew() {
        if (this.isAddingNew)
            this.onListChanged(
                new ListChangedEventArgs(ListChangedType.ItemAdded, this.currentPosition, -1)
            );

        super.commitNew();
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

    public newItemCreator = () => {
        const _item = {};
        if (!this.table) return _item;

        for (const _col of this.table.columns) _item[_col.columnName] = _col.defaultValue;

        return _item;
    };

    remove(item: any): void {
        super.remove(item);

        if (this.table) this.table.remove(item);
    }

    /* _createGroups(items) {
        let _root: Array<wjc.CollectionViewGroup> = null;

        if (!this._grpDesc || this._grpDesc.length == 0)
            return null;

        if ((this.table && !this.table._bOverideCreateGroup) || this._grpDesc.length > 1) {
            _root = super._createGroups(items);
            return _root;
        }

        let _lastGroup: wjc.CollectionViewGroup = null;

        if (_root == null)
            _root = new Array();

        for (let _i = 0; _i < items.length; _i++) {
            let _item = items[_i],
                _groups = _root,
                _levels = this._grpDesc.length;

            let path = '';
            for (let _level = 0; _level < _levels; _level++) {
                let _gd: wjc.PropertyGroupDescription = this._grpDesc[_level],
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

    private getGroup(gd: wjc.GroupDescription, groups: wjc.CollectionViewGroup[], name: string, level: number, isBottomLevel: boolean,
        lastGroup: wjc.CollectionViewGroup) {
        let _g: wjc.CollectionViewGroup = null;

        if (lastGroup == null || this._compareValue(lastGroup.name, name) != 0) {
            _g = new wjc.CollectionViewGroup(gd, name, level, isBottomLevel);
            groups.push(_g);
        }

        return _g != null ? _g : lastGroup;
    }

    private _compareValue(val0: any, val1: any) {
        if (Date.isDate(val0) || Date.isDate(val1) ||
            Number.isNumber(val0) || Number.isNumber(val1))
            return Object.compare(val0, val1);

        return String.compare(val0, val1);
    } */

    _compareItems() {
        if (this._srtCmp == null) this._srtCmp = this._sortCmp.bind(this);

        return super._compareItems();
    }

    private _sortCmp(v1, v2) {
        if (v1 != null && v2 == null) return +1;
        if (v1 == null && v2 != null) return -1;

        return null;
    }

    public _performFilter(items: any[]) {
        if (this.table && this.table.parentRelations.length > 0)
            items = items.filter(this._filterRelation, this);

        return super._performFilter(items);
    }

    private _filterRelation(item) {
        if (!this.table || this.table.parentRelations.length < 1) return true;

        for (let _i = 0; _i < this.table.parentRelations.length; _i++) {
            const _relation: WebRelation = wjc.tryCast(
                this.table.parentRelations[_i],
                'IWebRelation'
            );
            if (_relation == null) continue;

            const _keys = new Map<string, string>();
            const _childKeys = _relation.childKey.getColumnNames();
            const _parentKeys = _relation.parentKey.getColumnNames();
            _childKeys.map((value, index) => _keys.set(value, _parentKeys[index]));
            if (WebDataView.filterWithRelation(item, _relation.parentTable.currentItem, _keys))
                return true;
        }

        return false;
    }

    public onCurrentChanged(e?: wjc.EventArgs) {
        super.onCurrentChanged(e);
        if (this.table) {
            if (this.table.childRelations.length > 0) {
                for (let _i = 0; _i < this.table.childRelations.length; _i++) {
                    const _relation: WebRelation = wjc.tryCast(
                        this.table.childRelations[_i],
                        'IWebRelation'
                    );
                    if (!_relation || !_relation.childKey) continue;
                    this.table.currentItem = this.currentItem;
                    _relation.childTable.onRefreshViewRelation();
                }
            }
        }
    }

    public onCollectionChanged(e) {
        if (e instanceof wjc.NotifyCollectionChangedEventArgs) {
            if (e.action == wjc.NotifyCollectionChangedAction.Change) {
                if (this.items.indexOf(e.item) < 0) return;
            }
        }

        if (this.table && e instanceof wjc.NotifyCollectionChangedEventArgs)
            this.table.handleCollectionChanged(this.sourceCollection, e);

        super.onCollectionChanged(e);
    }

    public addNew() {
        const _item = super.addNew();

        if (this.table) {
            if (this.table.items.indexOf(_item) < 0) this.table.items.push(_item);

            const _dr = this.table.rows.find((r) => Object.is(r.item, _item));
            const _drv = new WebDataRowView(this, _dr);
            return _drv;
        }

        return _item;
    }

    public dispose() {
        for (const prop in this) {
            try {
                const evt = this[prop];
                if (evt instanceof wjc.Event) {
                    evt.removeAllHandlers();
                }
            } catch {}
        }
    }

    public implementsInterface(interfaceName: string) {
        return (
            interfaceName == 'IBindingList' ||
            interfaceName == 'IWebDataView' ||
            super.implementsInterface(interfaceName)
        );
    }
}
