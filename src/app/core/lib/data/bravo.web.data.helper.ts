import { DataKey } from './bravo.constraint';
import { WebDataRow, DataRowVersion } from './bravo.web.datarow';
import { tryCast } from '@grapecity/wijmo';

export function getKeyValues(key: DataKey, val: any, version?: DataRowVersion) {
    let _cols = key.getColumnNames();
    let array = new Array(_cols.length);

    for (let _nCol = 0; _nCol < _cols.length; _nCol++) {
        const _zColName = _cols[_nCol];

        const _row = tryCast(val, 'IWebDataRow') as WebDataRow;
        if (_row) array[_nCol] = _row.getValue(_zColName, version);
        else if (val) array[_nCol] = val[_zColName];
    }

    return array;
}

export function arraysIdentical(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] != b[i]) return false;
    }
    return true;
}
