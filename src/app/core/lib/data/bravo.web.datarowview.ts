import * as wjc from "@grapecity/wijmo";
import { WebDataRow } from "./bravo.web.datarow";
import { DataRowChangeEventArgs } from "./bravo.web.datatable";
import { WebDataView } from "./bravo.web.dataview";
import { DataRowAction, DataRowState } from "./enums";

export class WebDataRowView {
    public readonly row: WebDataRow;

    private readonly dataSource: any;

    constructor(pSource?: any, pRow?: WebDataRow) {
        this.row = pRow;
        this.dataSource = pSource;
    }

    public get dataView(): WebDataView {
        return wjc.tryCast(this.dataSource, 'IWebDataView');
    }

    public setValue(key: any, value: any) {
        if (!this.dataView || !this.row)
            return

        // this.row.table.initDefaultView(this.dataView);

        try {
            this.row.setValue(key, value);
        }
        finally {
            // this.row.table.releaseDefaultView()
        }
    }

    public endEdit() {
        if (!this.row || !this.dataView || !this.dataView.table)
            return;

        const _row = this.row
        const _dv = this.dataView;
        const _tb = this.dataView.table;

        const _args = new DataRowChangeEventArgs(_row, DataRowAction.Add);
        _tb.onRowChanging(_args, _row, DataRowAction.Add);
        if (_args.cancel) {
            _dv.cancelNew();
            return;
        }

        if (_row.rowState != DataRowState.Added)
            _row.rowState = DataRowState.Added;

        if (_dv._newItem)
            _dv.commitNew();

        if (_dv._edtItem)
            _dv.commitEdit();

        _tb.onRowChanged(_args, _row, DataRowAction.Add);
    }
}