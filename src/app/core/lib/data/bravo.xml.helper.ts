import * as wjc from "@grapecity/wijmo";
import { WebDataTable } from './bravo.web.datatable';
import { WebDataColumn } from './bravo.web.datacolumn';
import { DataViewRowState, TypeCode } from './enums';
import { BravoCulture } from '../bravo.culture';
import { IWebDataSet } from '../interface/IWebDataSet';
import { StringBuilder } from './string.builder';
import { Convert } from "../convert";
import { BravoDataTypeConverter } from "../bravo.datatype.converter";
import { BravoGlobalize } from "../bravo.globalize";
import { escapeXml } from "../bravo.core.function";

export class BravoXmlHelper {

    private static removeFirstLine(pzStr: string): string {
        let _lines = pzStr.split("\n");

        let _sb = new StringBuilder();
        for (let _i = 1; _i < _lines.length; _i++)
            _sb.appendLine("\t" + _lines[_i]);

        return _sb.toString();
    }

    public static writeDataSet(pDataSet: IWebDataSet, pTables: string[] = null,
        pColumns: string[] = null, pbUseTableAlias: boolean = false,
        pType: BravoXmlStringTypeEnum = BravoXmlStringTypeEnum.ElementMappingWithSchema, pFormat: any = null): string {
        if (pDataSet == null)
            throw new Error("pDataSet");

        let _zDataSetName = 'NewDataSet';
        if (!String.isNullOrEmpty(pDataSet.name))
            _zDataSetName = pDataSet.name;

        if (pFormat == null) pFormat = BravoCulture.ci;

        let _sbXml = new StringBuilder();
        _sbXml.appendLine('<?xml version="1.0" standalone="yes"?>');
        _sbXml.appendLine(String.format("<{0}>", _zDataSetName));

        if (pType == BravoXmlStringTypeEnum.ElementMappingWithSchema) {
            let _ds = pDataSet;
            for (let _tb of _ds.tables) {
                if (_tb instanceof WebDataTable) {
                    if (pbUseTableAlias) {
                        let _zAlias = _tb.name;
                        if (String.compare(_tb.name, _zAlias) != 0)
                            _tb.name = _zAlias;
                    }

                    /* for (let _col of _tb.columns) {
                        if (_col instanceof WebDataColumn) {
                            if (_col.dataType == TypeCode.DateTime)
                                _col.dataType = TypeCode.String;
                        }
                    } */
                }
            }

            let _sbSchema = new StringBuilder();
            let _sw = new StringWriter(_sbSchema, pFormat)
            BravoXmlHelper.writeXmlSchema(_ds, _sw)

            // _sw.close();
            _sbXml.append(_sbSchema.toString());
        }

        for (let _tb of pDataSet.tables) {
            if (pTables != null) {
                if (_tb instanceof WebDataTable) {
                    if (pTables.indexOf(_tb.name) < 0 && pTables.indexOf(_tb.name) < 0)
                        continue;
                }
            }

            _sbXml.append(BravoXmlHelper.writeDataTable(_tb, pColumns, pbUseTableAlias, pType, pFormat));

        }

        _sbXml.append(String.format("</{0}>", _zDataSetName));

        return _sbXml.toString();
    }

    public static writeDataTable(pTable: WebDataTable, pColumns: string[],
        pbUseTableAlias: boolean, pType: BravoXmlStringTypeEnum, pFormat: any): string {

        if (pTable == null) throw new Error("pTable");

        const _drs = pTable.select(null, null, DataViewRowState.CurrentRows);

        const _sb = new StringBuilder();
        const _zTbName = pTable.name;

        for (let _i = 0; _i < _drs.length; _i++) {
            _sb.append("\t<");
            _sb.append(_zTbName);
            if (pType != BravoXmlStringTypeEnum.AttributeMapping)
                _sb.appendLine(">");

            const _columns = pTable.columns;
            for (let _nCol = 0; _nCol < _columns.length; _nCol++) {
                if (pColumns != null && pColumns.length > 0 && pColumns.indexOf(_columns[_nCol].columnName) < 0)
                    continue;

                const _col = _columns[_nCol],
                    _zColName = _col.columnName;

                let _val = _drs[_i].getValue(_nCol);
                if (_val != null) {
                    let _type = _col.dataType;
                    let _zVal: string = null;

                    if (_type == TypeCode.String) {
                        _zVal = escapeXml(_val.toString());
                    }
                    else if (_type == TypeCode.DateTime) {
                        const outArgs: { datetime: Date } = { datetime: null };
                        if (BravoDataTypeConverter.isDateTimeValue(_val, outArgs))
                            _zVal = BravoGlobalize.format(outArgs.datetime, "yyyy/MM/dd HH:mm:ss");
                        else
                            _zVal = _val;
                    }
                    else if (_type == TypeCode.ByteArray) {
                        _zVal = Convert.toBase64String(_val);
                    }
                    else if (_type == TypeCode.Boolean) {
                        _zVal = _val.toString();
                    }
                    else if (_type == TypeCode.Byte) {
                        if (Boolean.isBoolean(_val))
                            _zVal = String.format("{0}", Boolean.asBoolean(_val) ? 1 : 0);
                        else
                            _zVal = String.format("{0}", _val);
                    }
                    else {
                        _zVal = String.format("{0}", _val.toString());
                    }

                    if (pType == BravoXmlStringTypeEnum.AttributeMapping) {
                        _sb.append(' ');
                        _sb.append(_zColName);
                        _sb.append("=\"");
                        _sb.append(_zVal);
                        _sb.append("\"");
                    }
                    else {
                        _sb.append("\t\t<");
                        _sb.append(_zColName);
                        _sb.append('>');
                        _sb.append(_zVal);
                        _sb.append("</");
                        _sb.append(_zColName);
                        _sb.appendLine(">");
                    }
                }
            }

            if (pType == BravoXmlStringTypeEnum.AttributeMapping) {
                _sb.append(" />\n");
            }
            else {
                _sb.append("\t</");
                _sb.append(_zTbName);
                _sb.appendLine(">");
            }
        }

        return _sb.toString();
    }

    public static writeXmlSchema(data: any, sw: StringWriter) {
        let _sb = sw.stringBuilder;

        let _ds: IWebDataSet = wjc.tryCast(data, 'IWebDataSet');
        if (_ds != null) {
            _sb.appendLine('  <xs:schema id="NewDataSet" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" xmlns:msprop="urn:schemas-microsoft-com:xml-msprop">');
            _sb.appendLine('\t<xs:element name="NewDataSet" msdata:IsDataSet="true" msdata:UseCurrentLocale="true">');
            _sb.appendLine('\t  <xs:complexType>');
            _sb.appendLine('\t\t<xs:choice minOccurs="0" maxOccurs="unbounded">');

            for (let _tb of _ds.tables) {
                _sb.appendLine(String.format('\t\t  <xs:element name="{0}">', _tb.name));
                _sb.appendLine('\t\t\t<xs:complexType>');
                _sb.appendLine('\t\t\t  <xs:sequence>');
                for (let _dc of _tb.columns) {
                    if (_dc instanceof WebDataColumn) {
                        let _caption = '', _stringType = '', _default = '';

                        if (!String.isNullOrEmpty(_dc.caption))
                            _caption = String.format(' msdata:Caption="{0}"',
                                _dc.caption.replace(/\n/g, ' '));

                        if (_dc.dataType == TypeCode.String)
                            _stringType = String.format(' type="xs:{0}" minOccurs="0"', convertTypeCode(_dc.dataType));
                        else
                            _stringType = String.format(' type="xs:{0}"', convertTypeCode(_dc.dataType));

                        if (_dc.defaultValue !== null && _dc.defaultValue !== undefined) {
                            if (_dc.dataType == TypeCode.DateTime) {
                                let _date = new Date(_dc.defaultValue).toISOString();
                                _default = String.format(' default="{0}"', _date);
                            }
                            else
                                _default = String.format(' default="{0}"', _dc.defaultValue.toString());
                        }

                        _sb.appendLine(String.format('\t\t\t\t<xs:element name="{0}"{1}{2}{3} />', _dc.columnName, _caption, _stringType, _default));
                    }
                }

                _sb.appendLine('\t\t\t  </xs:sequence>')
                _sb.appendLine('\t\t\t</xs:complexType>');
                _sb.appendLine('\t\t  </xs:element>');
            }

            _sb.appendLine('\t\t</xs:choice>');
            _sb.appendLine('\t  </xs:complexType>');
            _sb.appendLine('\t</xs:element>');
            _sb.appendLine('  </xs:schema>');

        }
        else if (data instanceof WebDataTable) {
            _sb.appendLine(String.format('\t\t  <xs:element name="{0}">', data.name));
            _sb.appendLine('\t\t\t<xs:complexType>');
            _sb.appendLine('\t\t\t  <xs:sequence>');

            for (let _dc of data.columns) {
                if (_dc instanceof WebDataColumn) {
                    let _caption = '', _stringType = '', _default = '';
                    if (!wjc.isNullOrWhiteSpace(_dc.caption)) _caption = String.format(' msdata:Caption="{0}"', _dc.caption);

                    if (_dc.dataType == TypeCode.String)
                        _stringType = String.format(' type="xs:{0}" minOccurs="0"', convertTypeCode(_dc.dataType));
                    else
                        _stringType = String.format(' type="xs:{0}"', convertTypeCode(_dc.dataType));

                    if (_dc.defaultValue !== null && _dc.defaultValue !== undefined) {
                        if (_dc.dataType == TypeCode.DateTime) {
                            let _date = new Date(_dc.defaultValue).toISOString();
                            _default = String.format(' default="{0}"', _date);
                        }
                        else
                            _default = String.format(' default="{0}"', _dc.defaultValue.toString());
                    }

                    _sb.appendLine(String.format('\t\t\t\t<xs:element name="{0}"{1}{2}{3} />', _dc.columnName, _caption, _stringType, _default));
                }
            }

            _sb.appendLine('\t\t\t  </xs:sequence>')
            _sb.appendLine('\t\t\t</xs:complexType>');
            _sb.appendLine('\t\t  </xs:element>');
        }
    }
}

function replaceXMLInvalidChars(str: string): string {
    let _invalidXMLCharsRegex: RegExp = new RegExp(/[<>]/g);

    if (_invalidXMLCharsRegex.test(str)) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    return str;
}

function convertTypeCode(dataType) {
    let _resutl = '';

    switch (dataType) {
        case TypeCode.DateTime:
            _resutl = "dateTime";
            break;
        case TypeCode.Int16:
            _resutl = "int"
            break;
        case TypeCode.Int32:
            _resutl = "int"
            break;
        case TypeCode.Int64:
            _resutl = "int"
            break;
        case TypeCode.String:
            _resutl = "string"
            break;
        case TypeCode.Boolean:
            _resutl = "boolean"
            break;
        case TypeCode.Double:
            _resutl = "double"
            break;
        case TypeCode.Byte:
            _resutl = "unsignedByte"
            break;
        case TypeCode.Decimal:
            _resutl = "decimal"
            break;
        case TypeCode.Object:
            _resutl = "string"
            break;
        case TypeCode.ByteArray:
            _resutl = "base64Binary"
            break
        default:
            break;
    }

    return _resutl;
}

export function convertStringToType(pzType: string) {
    switch (pzType) {
        case "dateTime":
            return TypeCode.DateTime;
        case "int":
            return TypeCode.Int32;
        case "string":
            return TypeCode.String;
        case "boolean":
            return TypeCode.Boolean;
        case "double":
            return TypeCode.Double;
        case "unsignedByte":
            return TypeCode.Byte
        case "decimal":
            return TypeCode.Decimal;
        case "base64Binary":
            return TypeCode.ByteArray;
        default:
            return TypeCode.String;
    }
}

export class StringWriter {
    private _encoded: any;
    public get encoded(): any {
        return this._encoded;
    }
    public set encoded(value: any) {
        this._encoded = value;
    }

    private _stringBuilder: StringBuilder;
    public get stringBuilder(): StringBuilder {
        return this._stringBuilder;
    }
    public set stringBuilder(value: StringBuilder) {
        this._stringBuilder = value;
    }

    private _format: any;
    public get format(): any {
        return this._format;
    }
    public set format(value: any) {
        this._format = value;
    }

    constructor(sb?: StringBuilder, format?: any) {
        if (sb)
            this._stringBuilder = sb;

        if (format)
            this._format = format;
    }

    close() {
        this.stringBuilder.clear();
    }

}
export enum BravoXmlStringTypeEnum {
    AttributeMapping = 0,
    ElementMappingWithSchema = 1
}