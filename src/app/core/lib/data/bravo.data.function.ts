import * as wjc from '@grapecity/wijmo';
import { sameContent } from '../bravo.datatype.converter';
import { DataColumnChangeEventArgs } from './bravo.web.datacolumn';
import { WebDataRow } from './bravo.web.datarow';
import { DataRowState } from './enums';

export const SortPattern = /\[([^\]]*)\]|(\w*)(\s(ASC|DESC)*)*/i;

export function setCurrentEditItem(
    pCollection: any,
    pDataRow: WebDataRow,
    value: any
) {
    let _tb: any;
    if (wjc.tryCast(pCollection, 'IWebDataView')) _tb = pCollection.table;
    else if (wjc.tryCast(pCollection, 'IWebDataTable')) _tb = pCollection;

    const _cv = wjc.tryCast(
        pCollection,
        'ICollectionView'
    ) as wjc.CollectionView;
    if (!_tb || !_cv) return;

    let _item = value,
        _content = sameContent(_item, _cv._edtClone);

    if (
        _content &&
        !_content.flag &&
        !String.isNullOrEmpty(_content.key) &&
        _cv.currentPosition != -1
    ) {
        const _col = _tb.columns.get(_content.key);

        _cv._edtClone = {};
        _cv._extend(_cv._edtClone, _cv._edtItem);

        let _e = new DataColumnChangeEventArgs(pDataRow, _col, _content.value);
        _tb.onColumnChanging(_e);
        if (_e.cancel) {
            _cv.cancelEdit();
            return;
        }

        if (_item[_content.key] != _e.ProposedValue) {
            _item[_content.key] = _e.ProposedValue;
            if (_cv._edtClone) _cv._edtClone[_content.key] = _e.ProposedValue;
        }

        const _nCol = _tb.columns.getIndex(_content.key);
        if (pDataRow.rowState != DataRowState.Added) {
            if (pDataRow.rowState == DataRowState.Unchanged)
                pDataRow.originalItems = [...pDataRow.currentItems];

            pDataRow.currentItems[_nCol] = _e.ProposedValue;
        } else {
            if (pDataRow.currentItems == null)
                pDataRow.currentItems = new Array(_tb.columns.count);

            pDataRow.currentItems[_nCol] = _e.ProposedValue;
        }

        _e = new DataColumnChangeEventArgs(
            pDataRow,
            _col,
            _e.ProposedValue,
            _item
        );
        _tb.onColumnChanged(_e);
    }
}

export function buildSort(cv: wjc.CollectionView, pzSort: string) {
    let _exprs = pzSort.split(',');
    for (const _orderExpr of _exprs) {
        if (String.isNullOrEmpty(_orderExpr)) continue;

        let _m = _orderExpr.match(SortPattern);
        let _zColName = String.isNullOrEmpty(_m[1]) ? _m[2] : _m[1];

        let _tb: any;

        const _dv = wjc.tryCast(cv, 'IWebDataView');
        if (_dv) _tb = _dv.table;
        else _tb = wjc.tryCast(cv, 'IWebDataTable');

        if (!_tb || !_tb.columns.contains(_zColName)) continue;

        if (cv.sortDescriptions.findIndex((s) => s.property == _zColName) != -1)
            continue;

        let _s = new wjc.SortDescription(
            _zColName,
            !_orderExpr.includes('DESC')
        );
        cv.sortDescriptions.push(_s);
    }
}
