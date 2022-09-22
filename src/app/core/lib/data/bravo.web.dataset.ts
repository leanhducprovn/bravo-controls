import { WebDataTable, WebTableCollection } from './bravo.web.datatable';
import { BravoXmlHelper, convertStringToType } from './bravo.xml.helper';
import { IWebDataSet } from '../interface/IWebDataSet';
import { WebRelationCollection, WebSetRelationCollection } from './bravo.web.datarelation';
import { WebDataColumn } from './bravo.web.datacolumn';
import { DataRowState, MissingSchemaAction } from './enums';
import { WebDataRow } from './bravo.web.datarow';
import { Encoding } from '../encoding';
import { tryCast } from '@grapecity/wijmo';
import { BravoDataTypeConverter } from '../bravo.datatype.converter';

export class WebDataSet implements IWebDataSet {
    private _bInitProgress = false;

    public get isInitialized(): boolean {
        return this._bInitProgress;
    }

    private _caseSensitive: boolean = false;

    public get caseSensitive(): boolean {
        return this._caseSensitive;
    }

    public set caseSensitive(value: boolean) {
        this._caseSensitive = value;
    }

    public prefix: string;

    private _tables: WebTableCollection = null;

    public get tables(): WebTableCollection {
        return this._tables;
    }

    public get hasErrors(): boolean {
        if (this._tables == null || this._tables.length < 1)
            return false;

        for (let _i = 0; _i < this.tables.length; _i++) {
            const _tb = this.tables[_i] as WebDataTable;
            if (_tb.hasErrors)
                return true;
        }

        return false;
    }

    private _extendedProperties: Map<string, any> = null;

    public get extendedProperties(): Map<string, any> {
        if (!this._extendedProperties)
            this._extendedProperties = new Map<string, any>();

        return this._extendedProperties;
    }

    private _relationCollection: WebRelationCollection = null;

    public get relations(): WebRelationCollection {
        return this._relationCollection;
    }

    private _name: string;

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    constructor() {
        this._tables = new WebTableCollection(this);
        this._relationCollection = new WebSetRelationCollection(this);
    }

    public beginUpdate() {
        if (!this.tables || this.tables.length < 1)
            return;

        for (let _i = 0; _i < this.tables.length; _i++) {
            const _tb = tryCast(this.tables[_i], 'IWebDataTable') as WebDataTable;
            if (!_tb) continue;

            _tb.beginUpdate();
        }
    }

    public endUpdate() {
        if (!this.tables || this.tables.length < 1)
            return;

        for (let _i = 0; _i < this.tables.length; _i++) {
            const _tb = tryCast(this.tables[_i], 'IWebDataTable') as WebDataTable;
            if (!_tb) continue;

            _tb.endUpdate();
        }
    }

    public beginInit() {
        this._bInitProgress = true;
    }

    public copy() {
        const _ds = new WebDataSet();
        for (const _tb of this._tables) {
            const _tbCopy = _tb.copy();
            _ds.tables.add(_tbCopy);
        }

        for (const _relation of this._relationCollection) {
            const _parentColumns = new Array;
            const _childColumns = new Array;
            const _parentTable = _ds.tables.get(_relation.parentTable.name);
            const _childTable = _ds.tables.get(_relation.childTable.name);

            if (_parentTable && _relation.parentColumns) {
                _relation.parentColumns.forEach(_col => {
                    const _parentCol = _parentTable.columns.get(_col.columnName);
                    if (_parentCol) _parentColumns.push(_parentCol);

                });
            }

            if (_childTable && _relation.childColumns) {
                _relation.childColumns.forEach(_col => {
                    const _childCol = _childTable.columns.get(_col.columnName);
                    if (_childCol) _childColumns.push(_childCol);
                });
            }

            if (!_relation.childConstrainKey)
                continue;

            const _relationCopy = _ds._relationCollection.add(_relation.relationName, _parentColumns, _childColumns);
            _relationCopy.childConstrainKey.updateRule = _relation.childConstrainKey.updateRule;
            _relationCopy.childConstrainKey.deleteRule = _relation.childConstrainKey.deleteRule;
        }

        if (this.extendedProperties.size > 0) {
            this.extendedProperties.forEach((value, key) => {
                if (_ds.extendedProperties.has(key))
                    _ds.extendedProperties.set(key, value);
            })
        }

        return _ds;
    }

    public merge(pData: WebDataSet | WebDataTable, preserveChanges: boolean = false,
        missingSchemaAction: MissingSchemaAction = MissingSchemaAction.Add) {
        if (pData instanceof WebDataSet) {
            for (const _tb of pData.tables) {
                if (!(_tb instanceof WebDataTable))
                    continue;

                if (this.tables.contains(_tb.name)) {
                    const _tb0 = this.tables.get(_tb.name);
                    if (_tb0) _tb0.merge(_tb, preserveChanges, missingSchemaAction);
                }
                else {
                    if (missingSchemaAction == MissingSchemaAction.Add ||
                        missingSchemaAction == MissingSchemaAction.AddWithKey) {
                        const _tb1 = _tb.clone();
                        this.tables.add(_tb1);
                        _tb1.merge(_tb, preserveChanges, missingSchemaAction);
                    }
                }
            }
        }
        else {
            const _tb0 = this.tables.get(pData.name);
            if (_tb0) _tb0.merge(pData, preserveChanges, missingSchemaAction);
        }
    }

    public mergeRows(rows: Array<WebDataRow>, preserveChanges: boolean = false,
        missingSchemaAction: MissingSchemaAction = MissingSchemaAction.Add) {
        let _tables = new Array<WebDataTable>();
        for (const _row of rows) {
            if (_row == null) continue;

            const _tb = _row.table;
            const _tb0 = this.tables.get(_tb.name);
            if (_tb0 == null) continue;

            if (!_tables.includes(_tb0))
                _tables.push(_tb0);
        }

        for (const _tb of _tables) {
            _tb.mergeRows(rows.filter(row => row.table.name == _tb.name), preserveChanges, missingSchemaAction);
        }
    }

    public clear() {
        for (let _n = 0; _n < this.tables.length; _n++) {
            const _tb = this.tables[_n];
            if (_tb instanceof WebDataTable) {
                const _bLastUpdate = _tb.isUpdating;
                if (!_bLastUpdate) _tb.beginUpdate();

                try {
                    _tb.clear();
                }
                finally {
                    if (!_bLastUpdate) _tb.endUpdate();
                }
            }
        }
    }

    public dispose() {
        for (let _n = this.tables.length - 1; _n >= 0; _n--) {
            let _tb = this.tables[_n];
            if (_tb instanceof WebDataTable) {
                _tb.dispose();
                _tb = null;
            }
        }

        if (this._tables)
            this._tables.clear();
    }

    public endInit() {
        this._bInitProgress = false;
    }

    public writeJson(pbFormat: boolean = false, pbReturnBuffer: boolean = true) {
        if (this.tables.length < 0)
            return null;

        let _tbCollection = new Array<WebDataTable>();
        for (const _tb of this.tables) {
            if (_tb instanceof WebDataTable && _tb.columns.length > 0 && _tb.rows.length > 0) {
                _tbCollection.push(_tb);
            }
        }

        let _obj = {};
        for (const _tb of _tbCollection) {
            let _item = JSON.parse(_tb.writeJson())
            _obj[_tb.name] = _item;
        }

        let _zJson = pbFormat ? JSON.stringify(_obj, null, 2) : JSON.stringify(_obj);
        return pbReturnBuffer ? Encoding.UTF8.getBytes(_zJson) : _zJson;
    }

    public acceptChanges() {
        for (let _n = 0; _n < this.tables.length; _n++) {
            const _tb = this.tables[_n];
            if (_tb instanceof WebDataTable) {
                _tb.acceptChanges();
            }
        }
    }

    public hasChanges(rowState?: DataRowState): boolean {
        if (this._tables == null || this._tables.length < 1)
            return false;

        if (rowState == null)
            rowState = DataRowState.Added | DataRowState.Modified | DataRowState.Deleted;

        for (let _i = 0; _i < this.tables.length; _i++) {
            const _tb = this.tables[_i] as WebDataTable;
            for (let _i = 0; _i < _tb.rows.length; _i++) {
                const _row = _tb.rows[_i];
                if ((_row.rowState & rowState) != 0)
                    return true;
            }
        }

        return false;
    }

    public writeXml() {
        let _xml = BravoXmlHelper.writeDataSet(this);
        return Encoding.UTF8.getBytes(_xml);
    }

    public readXml(pzContent: string) {
        let _parser = new DOMParser(),
            _xmlDoc = _parser.parseFromString(pzContent, 'text/xml');

        if (_xmlDoc == null || _xmlDoc.childElementCount != 1)
            return;

        let _ds: WebDataSet = this;
        _ds.name = _xmlDoc.firstElementChild.tagName;

        let _dsXml = _xmlDoc.firstElementChild;
        if (_dsXml == null || !_dsXml.hasChildNodes())
            return;

        let _xmlSchema = _xmlDoc.getElementById(_ds.name);
        if (_xmlSchema != null && _xmlSchema.tagName == "xs:schema") {
            let _xmlChoice = _xmlSchema.getElementsByTagName("xs:choice");
            if (_xmlChoice && _xmlChoice.length == 1) {
                let _xmlTables = _xmlChoice.item(0);
                for (let _i = 0; _i < _xmlTables.children.length; _i++) {
                    let _xmlTable = _xmlTables.children.item(_i);
                    let _zTableName = _xmlTable.getAttribute('name');
                    if (!_zTableName || _ds.tables.contains(_zTableName)) continue;

                    let _tb = new WebDataTable(_zTableName);
                    _ds.tables.add(_tb);

                    let _xmlSequence = _xmlTable.getElementsByTagName('xs:sequence');
                    if (_xmlSequence && _xmlSequence.length == 1) {
                        let _xmlCols = _xmlSequence.item(0);
                        for (let _j = 0; _j < _xmlCols.children.length; _j++) {
                            let _xmlCol = _xmlCols.children.item(_j);

                            let _zColName = _xmlCol.getAttribute('name');
                            if (!_zColName) continue;


                            let _col: WebDataColumn

                            if (_xmlCol.children.length != 0) {
                                console.log(_xmlCol.getElementsByTagName('xs:restriction').item(0))
                                let _base = convertStringToType(WebDataSet.getStringType(_xmlCol.children[0].children[0].getAttribute('base')));
                                _col = new WebDataColumn(_zColName, _base);
                            } else {
                                let _type = convertStringToType(WebDataSet.getStringType(_xmlCol.getAttribute('type')));
                                _col = new WebDataColumn(_zColName, _type);
                            }

                            const _zCaption = _xmlCol.getAttribute('msdata:Caption');
                            if (_zCaption) _col.caption = _zCaption;

                            _tb.columns.add(_col);
                        }
                    }
                }
            }
        }

        if (_ds.tables.length > 0) {
            for (const _tb of _ds.tables) {
                if (!(_tb instanceof WebDataTable))
                    continue;

                let _xmlRows = _xmlDoc.getElementsByTagName(_tb.name);
                if (_xmlRows && _xmlRows.length < 1)
                    continue;

                for (let _i = 0; _i < _xmlRows.length; _i++) {
                    let _xmlRow = _xmlRows.item(_i);
                    if (_xmlRow == null) continue;

                    const _row = _tb.newRow();

                    for (let _j = 0; _j < _xmlRow.children.length; _j++) {
                        let _tagName = _xmlRow.children.item(_j).tagName;
                        let _col = _tb.columns.get(_tagName)
                        if (!_col)
                            _col = _tb.columns.add(_tagName);

                        let _val = _xmlRow.children.item(_j).textContent;
                        try {
                            _val = BravoDataTypeConverter.convertValue(_val, _col.dataType);
                        }
                        catch { }

                        _row.setValue(_tagName, _val);
                    }

                    _tb.endEdit(_row);
                }

            }
        }
        else if (_dsXml.children.length > 0) {
            for (let _i = 0; _i < _dsXml.children.length; _i++) {
                let _xmlTable = _dsXml.children.item(_i);
                let _zTableName = _xmlTable.tagName;

                if (!_zTableName) continue;

                let _tb: WebDataTable;
                if (!_ds.tables.contains(_zTableName))
                    _tb = _ds.tables.add(_zTableName);
                else
                    _tb = _ds.tables.get(_zTableName);

                const _row = _tb.newRow();

                if (_xmlTable.children.length == 0) {
                    let _attrs = _xmlTable.getAttributeNames();
                    for (const _key of _attrs) {
                        let _col = _tb.columns.get(_key)
                        if (!_col)
                            _col = _tb.columns.add(_key);

                        let _val = _xmlTable.getAttribute(_key);
                        try {
                            _val = BravoDataTypeConverter.convertValue(_val, _col.dataType);
                        }
                        catch { }

                        _row.setValue(_key, _val);
                    }
                }
                else {
                    for (let _j = 0; _j < _xmlTable.children.length; _j++) {
                        let _tagName = _xmlTable.children.item(_j).tagName;
                        let _col = _tb.columns.get(_tagName)
                        if (!_col)
                            _col = _tb.columns.add(_tagName);

                        let _val = _xmlTable.children.item(_j).textContent;
                        try {
                            _val = BravoDataTypeConverter.convertValue(_val, _col.dataType);
                        }
                        catch { }

                        _row.setValue(_tagName, _val);
                    }
                }

                _tb.endEdit(_row);
            }
        }
    }

    public implementsInterface(interfaceName: string) {
        return interfaceName == 'IWebDataSet';
    }

    private static getStringType(attr: string) {
        if (!attr && !attr.startsWith('xs:'))
            return attr;

        return attr.substring('xs:'.length);
    }
}