import { DbType, TypeCode } from './data/enums';
import * as wjc from '@grapecity/wijmo';
import { Dictionary } from './data/bravo.web.dictionary';
import { BravoGlobalize } from './bravo.globalize';
import { BravoCulture } from './bravo.culture';
import { Convert } from './convert';
import { InvalidCastException } from './exception/invalid.cast.exception';
import { compareStrings } from './bravo.core.function';
import * as mnt from 'moment';
const moment = mnt;

export function assert(condition: boolean, msg: string) {
    if (!condition) {
        throw '** Assertion failed in Bravo: ' + msg;
    }
}

export function isString(value: any): boolean {
    return typeof value === 'string';
}

export function isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export function isNumericValue(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export function isIntegerType(value: any): boolean {
    return !isNaN(parseInt(value)) && isFinite(value);
}

export function isObject(value: any): boolean {
    return value != null && typeof value === 'object' && !isDate(value);
}

export function isDate(value: any): boolean {
    return value instanceof Date && !isDate(value.getTime());
}

export function clone(src: any): any {
    try {
        return JSON.parse(JSON.stringify(src));
    } catch {
        return null;
    }
}

export function getType(value): TypeCode {
    if (isString(value)) return TypeCode.String;
    if (isIntegerType(value)) return TypeCode.Int32;
    if (isNumericValue(value)) return TypeCode.Decimal;
    if (isDate(value)) return TypeCode.DateTime;
    if (isArray(value)) return TypeCode.ByteArray;

    return TypeCode.Object;
}

export function convertTypeToDbType(type: TypeCode): DbType {
    if (type == TypeCode.String) return DbType.String;
    else if (type == TypeCode.ByteArray) return DbType.Binary;
    else if (type == TypeCode.Byte) return DbType.Byte;
    else if (type == TypeCode.Boolean) return DbType.Boolean;
    else if (type == TypeCode.DateTime) return DbType.DateTime;
    else if (type == TypeCode.Decimal) return DbType.Decimal;
    else if (type == TypeCode.Double) return DbType.Double;
    else if (type == TypeCode.Int16) return DbType.Int16;
    else if (type == TypeCode.Int32) return DbType.Int32;
    else if (type == TypeCode.Int64) return DbType.Int64;
    else if (type == TypeCode.UInt16) return DbType.UInt16;
    else if (type == TypeCode.UInt32) return DbType.UInt32;
    else if (type == TypeCode.UInt64) return DbType.UInt64;
    else return DbType.Object;
}

export function isBoolean(value: any): boolean {
    return typeof value === 'boolean';
}

export function isArray(value: any): boolean {
    return (
        value instanceof Array || // doesn't work on different windows
        Array.isArray(value) || // doesn't work on derived classes
        Object.prototype.toString.call(value) === '[object Array]'
    ); // always works
}

export function isFunction(value: string): boolean {
    return typeof value === 'function';
}

export function asFunction(value: any, nullOK = true): Function {
    assert((nullOK && value == null) || isFunction(value), 'Function expected.');
    return value;
}

export function sameContent(dst: any, src: any) {
    for (const key in src) {
        if (dst && !sameValue(dst[key], src[key])) {
            return { flag: false, key: key, value: dst[key] };
        }
    }

    for (const key in dst) {
        if (src && !sameValue(dst[key], src[key])) {
            return { flag: false, key: key, value: dst[key] };
        }
    }

    return { flag: true, key: undefined, value: undefined };
}

export function sameValue(v1: any, v2: any) {
    return Object.is(v1, v2) || wjc.DateTime.equals(v1, v2);
}

export class BravoDataTypeConverter {
    public static isDateTimeValue(pValue: any, outArgs: { datetime: Date }, culture?: string) {
        if (outArgs == null) return false;

        if (pValue instanceof Date) {
            outArgs.datetime = pValue;
            return true;
        }

        outArgs.datetime = this.convertValue(pValue, TypeCode.DateTime, culture);
        if (outArgs.datetime instanceof Date) return true;

        return false;
    }

    public static isNumericValue(pValue: any, outArgs: { num: number }) {
        if (pValue == null) {
            outArgs.num = 0;
            return false;
        }

        let _z = String.format('{0}', pValue).trim();
        let _bIsPercentage = false;
        let _zPercentSign = '%';

        if (_z.startsWith(_zPercentSign) || _z.endsWith(_zPercentSign)) {
            _bIsPercentage = true;
            _z = _z.trimChars(_zPercentSign).trim();
        }

        if (_z.includes(',')) _z = _z.replace(/,/g, '');

        const _val = this.convertValue(_z, TypeCode.Decimal);
        if (_val != null && !isNaN(_val)) {
            outArgs.num = _bIsPercentage ? _val / 100 : _val;
            return true;
        }

        outArgs.num = 0;
        return false;
    }

    public static convertValue(value: any, type: TypeCode, culture?: string) {
        if (value == null || value == undefined) return value;

        if (culture == null) culture = BravoCulture.ci;

        if (type == TypeCode.Boolean) return Boolean.asBoolean(value);

        if (type == TypeCode.DateTime) {
            if (Date.isDate(value)) return Date.asDate(value);

            try {
                if (!wjc.isString(value)) value = value.toString();

                // for testing convert Date
                if (culture == BravoCulture.ci) {
                    try {
                        const _val = new Date(value);
                        if (_val instanceof Date) return _val;
                    } catch {}
                }

                let _parts = BravoGlobalize.sqlDatePartsRegions[culture.substr(0, 2)];
                for (const part of _parts) {
                    if (value.length != part.length) continue;

                    let _validDate = BravoDataTypeConverter.isMomentValidDate(value, part);
                    if (moment.isMoment(_validDate) && _validDate.isValid())
                        return _validDate.toDate();

                    // let _date = wjc.Globalize.parseDate(value, part);
                    // if (_date instanceof Date)
                    //     return _date;
                }
            } catch (_ex) {
                throw _ex;
            }

            throw new InvalidCastException();
        }

        if (this.isNumericType(type) && Boolean.isBoolean(value)) return Boolean.asBoolean(value);

        if (this.isNumericType(type)) {
            if (Number.isNumber(value)) return Number.asNumber(value);

            const _val = Number(value);
            if (!isNaN(_val)) return _val;

            throw new Error('Input string was not in a correct format');
        }

        if (type == TypeCode.ByteArray && wjc.isString(value))
            return Convert.fromBase64String(value);

        if (type != TypeCode.String) {
            if (value instanceof Uint8Array) return value;

            if (value instanceof Array) return value;

            if (value instanceof Map) return value;

            if (value instanceof Dictionary) return value;

            if (type == TypeCode.Object && wjc.isString(value)) return value;

            if (String.isNullOrEmpty(value)) return null;
        }

        return `${value}`;
    }

    public static isMomentValidDate(value: string, pzFormat?: string, strictMode = true) {
        let _momentDate: moment.Moment;

        if (String.isNullOrEmpty(pzFormat)) _momentDate = moment(value);
        else _momentDate = moment(value, this.replaceFormatString(pzFormat), strictMode);

        if (_momentDate && _momentDate.isValid()) return _momentDate;
        return false;
    }

    private static replaceFormatString(pzFormat: string) {
        if (pzFormat == null) return Date.defaultFormat;

        pzFormat = pzFormat.toUpperCase();

        if (pzFormat.includes(':MM')) {
            pzFormat = pzFormat.replace(/(:MM)/, ':mm');
        }

        if (pzFormat.includes(':SS')) {
            pzFormat = pzFormat.replace(/(:SS)/, ':ss');
        }

        if (pzFormat.includes('TT')) {
            pzFormat = pzFormat.replace(/(TT)/, 'A');
        }

        if (pzFormat.includes('FFF')) {
            pzFormat = pzFormat.replace(/(FFF)/, 'SSS');
        }

        return pzFormat;
    }

    public static compareValue(
        val1: any,
        val2: any,
        type: TypeCode,
        pbIgnoreCaseString: boolean = false
    ) {
        // if (!val1 && !val2) return true;
        // if (!(val1 === 0) && !(val2 === 0)) {
        //     if (!val1 && !val2) return true;
        // }

        if ((val1 === null || val1 === undefined) && (val2 === null || val2 === undefined))
            return true;

        if (type == TypeCode.String) {
            val1 = String.format('{0}', val1).trimEnd();
            val2 = String.format('{0}', val2).trimEnd();
            if (compareStrings(val1, val2, pbIgnoreCaseString)) return true;
        }

        if (this.isNumericType(type)) {
            if (val1 != null && val1 != undefined && val2 != null && val2 != undefined) {
                if (type == TypeCode.Byte && val1 >= 0 && val1 <= 1 && val2 >= 0 && val2 <= 1)
                    return Boolean.asBoolean(val1) == Boolean.asBoolean(val2);

                return Number.asNumber(val1) == Number.asNumber(val2);
            }

            //fix zezo int, zero decimal
            /* if (type == TypeCode.Decimal) {
                if ((val1 == null || val1 == undefined) && Number.asNumber(val2) == 0)
                    return true;

                if ((val2 == null || val2 == undefined) && Number.asNumber(val1) == 0)
                    return true;
            } */
        }

        if (
            type == TypeCode.DateTime &&
            val1 != null &&
            val1 != undefined &&
            val2 != null &&
            val2 != undefined
        )
            return Date.asDate(val1).getTime() == Date.asDate(val2).getTime();

        if (type == TypeCode.ByteArray && val1 && val2) {
            return String.compare(Convert.toBase64String(val1), Convert.toBase64String(val2)) == 0;
        }

        if (val1 instanceof Array && val2 instanceof Array) {
            if (val1.length != val2.length) return false;

            for (let _i = 0; _i < val1.length; _i++)
                if (!this.compareValue(val1[_i], val2[_i], type, pbIgnoreCaseString)) return false;

            return true;
        }

        if (val1 instanceof Map && val2 instanceof Map) {
            if (val1.size != val2.size) return false;

            let _values = Array.from(val1.values());
            for (let _e of _values)
                if (
                    !val2.has(_e.key) ||
                    !this.compareValue(_e.value, val2.get(_e.key), type, pbIgnoreCaseString)
                )
                    return false;

            return true;
        }

        if (val1 instanceof Dictionary && val2 instanceof Dictionary) {
            if (val1.count != val2.count) return false;

            for (let _e of val1.values)
                if (
                    !val2.containsKey(_e.key) ||
                    !this.compareValue(_e.value, val2.getValue(_e.key), type, pbIgnoreCaseString)
                )
                    return false;

            return true;
        }

        return val1 === val2;
    }

    public static isNumericType(type: TypeCode) {
        return (
            type == TypeCode.Byte ||
            type == TypeCode.Decimal ||
            type == TypeCode.Double ||
            type == TypeCode.Int16 ||
            type == TypeCode.Int32 ||
            type == TypeCode.Int64 ||
            type == TypeCode.SByte ||
            type == TypeCode.Single ||
            type == TypeCode.UInt16 ||
            type == TypeCode.UInt32 ||
            type == TypeCode.UInt64
        );
    }

    public static isEnumType(enumType: any, value: any, pOutArgs?: { resultValue: any }) {
        for (const key in enumType) {
            if (
                key == value ||
                (wjc.isString(key) &&
                    wjc.isString(value) &&
                    key.toLowerCase() == value.toLowerCase())
            ) {
                if (pOutArgs) {
                    let _key = parseInt(key);
                    if (!isNaN(_key)) pOutArgs.resultValue = _key;
                    else pOutArgs.resultValue = enumType[key];
                }

                return true;
            }
        }

        return false;
    }

    public static toSize(pzSize: string) {
        if (String.isNullOrEmpty(pzSize) || !pzSize.includes(',')) return;

        const _arr = pzSize.split(',').filter((x) => x);
        return new wjc.Size(Number.asNumber(_arr[0]), Number.asNumber(_arr[1]));
    }

    public static toPoint(pzPoint: string) {
        if (String.isNullOrEmpty(pzPoint) || !pzPoint.includes(',')) return;

        const _arr = pzPoint.split(',').filter((x) => x);
        return new wjc.Point(Number.asNumber(_arr[0]), Number.asNumber(_arr[1]));
    }

    public static convertTypeCodeFromString(pzTypeCode: string) {
        if (pzTypeCode == 'System.Byte[]') return TypeCode.ByteArray;

        if (pzTypeCode.startsWith('System.')) pzTypeCode = pzTypeCode.substring('System.'.length);

        const _outArgs = { resultValue: null };
        if (this.isEnumType(TypeCode, pzTypeCode, _outArgs))
            return _outArgs.resultValue as TypeCode;

        return TypeCode.String;
    }

    public static convertTypeCodeStringToDataType(pzType: string) {
        if (String.isNullOrEmpty(pzType)) return;

        try {
            const _type = this.convertTypeCodeFromString(pzType);
            return this.convertTypeCodeToDataType(_type);
        } catch (_ex) {
            console.log('Conert type code error: ', _ex);
        }
    }

    public static convertTypeCodeToDataType(type: TypeCode) {
        switch (type) {
            case TypeCode.String:
                return wjc.DataType.String;
            case TypeCode.Int16:
            case TypeCode.Int32:
            case TypeCode.Int64:
            case TypeCode.Double:
            case TypeCode.Decimal:
            case TypeCode.UInt16:
            case TypeCode.UInt32:
            case TypeCode.UInt64:
            case TypeCode.Byte:
                return wjc.DataType.Number;
            case TypeCode.DateTime:
                return wjc.DataType.Date;
            case TypeCode.Boolean:
            case TypeCode.Byte:
                return wjc.DataType.Boolean;
            case TypeCode.SByte:
                return wjc.DataType.String;
            case TypeCode.ByteArray:
            case TypeCode.Object:
                return wjc.DataType.Object;
        }
    }
}
