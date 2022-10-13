import * as wjc from '@grapecity/wijmo';
import * as customFormat_ from 'clr-format';
const customFormat = customFormat_;

export class BravoGlobalize {
    public static format(
        value: any,
        format: string,
        culture?: any,
        trim?: boolean,
        truncate?: boolean
    ): string {
        // format numbers and dates, convert others to string
        if (wjc.isString(value)) {
            return value;
        } else if (wjc.isNumber(value)) {
            format = format || (value == Math.round(value) ? 'n0' : 'n2');

            if (format && format.includes('#')) {
                if (culture == null)
                    return customFormat(`{0:${format}}`, value);

                let _zValue: string,
                    //_culture = customFormat && customFormat.Globalization && customFormat.Globalization.CultureInfo ?
                    //  customFormat.Globalization.CultureInfo.CurrentCulture : null; //new customFormat.Globalization.CultureInfo('vi-VN');
                    _culture =
                        customFormat.Globalization.CultureInfo.CurrentCulture;
                if (_culture) {
                    let _cgs = _culture.NumberFormat.CurrencyGroupSeparator,
                        _ngs = _culture.NumberFormat.NumberGroupSeparator,
                        _cds = _culture.NumberFormat.CurrencyDecimalSeparator,
                        _nds = _culture.NumberFormat.NumberDecimalSeparator;

                    _culture.NumberFormat.CurrencyGroupSeparator =
                        _culture.NumberFormat.NumberGroupSeparator =
                            culture.Globalize.numberFormat[','];

                    _culture.NumberFormat.CurrencyDecimalSeparator =
                        _culture.NumberFormat.NumberDecimalSeparator =
                            culture.Globalize.numberFormat['.'];

                    _zValue = customFormat(_culture, `{0:${format}}`, value);

                    _culture.NumberFormat.CurrencyGroupSeparator = _cgs;
                    _culture.NumberFormat.NumberGroupSeparator = _ngs;
                    _culture.NumberFormat.CurrencyDecimalSeparator = _cds;
                    _culture.NumberFormat.NumberDecimalSeparator = _nds;
                }

                return _zValue;
            }

            return BravoGlobalize.formatNumber(
                value,
                format,
                culture,
                trim,
                truncate
            );
        } else if (wjc.isDate(value)) {
            format = format || 'd';

            if (format.startsWith('{0:')) {
                if (culture == null) return customFormat(format, value);

                return customFormat(culture, format, value);
            }

            return wjc.Globalize.formatDate(value, format);
        } else {
            return value != null ? value.toString() : '';
        }
    }

    public static formatNumber(
        value: number,
        format: string,
        culture?: any,
        trim?: boolean,
        truncate?: boolean
    ): string {
        if (culture == null)
            return wjc.Globalize.formatNumber(value, format, trim, truncate);

        value = wjc.asNumber(value);
        format = wjc.asString(format);
        let nf = culture.Globalize.numberFormat,
            m = format ? format.match(/([a-z])(\d*)(,*)(.*)/i) : null,
            f1 = m ? m[1].toLowerCase() : 'n',
            prec =
                m && m[2]
                    ? parseInt(m[2])
                    : f1 == 'c'
                    ? nf.currency.decimals
                    : value == Math.round(value)
                    ? 0
                    : 2,
            scale = m && m[3] ? 3 * m[3].length : 0,
            dp = nf['.'] || '.',
            ts = nf[','] || ',',
            neg = nf['-'] || '-',
            result;

        // scale (,:thousands ,,:millions ,,,:billions)
        if (scale) {
            value /= Math.pow(10, scale);
        }

        // d, x: integers/hexadecimal
        if (f1 == 'd' || f1 == 'x') {
            result = Math.round(Math.abs(value)).toString(f1 == 'd' ? 10 : 16);
            while (result.length < prec) {
                result = '0' + result;
            }
            if (value < 0) {
                result = neg + result;
            }
            if (format && format[0] == 'X') {
                result = result.toUpperCase();
            }
            return result;
        }

        // p: percentage
        if (f1 == 'p') {
            value = BravoGlobalize._mul100(value); // TFS 210383
            value = wjc.toFixed(value, prec, truncate); // TFS 227998
        }

        // truncate value
        if (truncate && f1 != 'p') {
            value = wjc.toFixed(value, prec, true);
        }

        // get result
        result = BravoGlobalize._toFixedStr(
            f1 == 'c' || f1 == 'p' ? Math.abs(value) : value,
            prec
        );

        // g: remove trailing zeros
        if ((trim || f1 == 'g') && result.indexOf('.') > -1) {
            result = result.replace(/(\.[0-9]*?)0+$/g, '$1');
            result = result.replace(/\.$/, '');
        }

        // replace decimal point
        if (dp != '.') {
            result = result.replace('.', dp);
        }

        // replace negative character
        if (neg != '-') {
            result = result.replace('-', neg);
        }

        // n, c, p: insert thousand separators (before decimal/neg replacements)
        if (ts && (f1 == 'n' || f1 == 'c' || f1 == 'p')) {
            let idx = result.indexOf(dp),
                rx = /\B(?=(\d\d\d)+(?!\d))/g;
            result =
                idx > -1
                    ? result.substr(0, idx).replace(rx, ts) + result.substr(idx)
                    : result.replace(rx, ts);
        }

        // c: currency pattern
        if (f1 == 'c') {
            let pat = nf.currency.pattern[value < 0 ? 0 : 1],
                curr = m && m[4] ? m[4] : nf.currency.symbol;
            if (curr == '\u200B') {
                // invisible space: TFS 295426
                curr = '';
            }
            result = pat.replace('n', result).replace('$', curr);
        }

        // p: percentage pattern
        if (f1 == 'p') {
            let pat = nf.percent.pattern[value < 0 ? 0 : 1],
                pct = nf['%'] || '%';
            result = pat.replace('n', result);
            if (pct != '%') result = result.replace('%', pct);
            if (neg != '-' && value < 0) result = result.replace('-', neg);
        }

        // done
        return result;
    }

    private static _toFixedStr(num: number, digits: number) {
        let str = num.toString(),
            decPos = str.indexOf('.'),
            xZeros = digits - (str.length - decPos) + 1;
        return str.indexOf('e') < 0 && decPos > -1 && xZeros >= 0
            ? str + Array(xZeros + 1).join('0')
            : num.toFixed(digits);
    }

    private static _mul100(n: number) {
        let str = n.toString(),
            pos = str.indexOf('.');

        // we don't do scientific notation
        if (str.indexOf('e') > -1) {
            return n * 100;
        }

        // multiply string by 100
        if (pos < 0) {
            str += '00';
        } else {
            pos += 2;
            str = str.replace('.', '') + '00';
            str = str.substr(0, pos) + '.' + str.substr(pos);
        }

        // parse string
        return parseFloat(str);
    }

    public static getFormatFromPattern(pzFormat: string) {
        if (String.compare(pzFormat, 'd') == 0)
            return wjc.culture.Globalize.calendar.patterns.d;
        else if (String.compare(pzFormat, 'D') == 0)
            return wjc.culture.Globalize.calendar.patterns.D;
        else if (String.compare(pzFormat, 'f') == 0)
            return wjc.culture.Globalize.calendar.patterns.f;
        else if (String.compare(pzFormat, 'F') == 0)
            return wjc.culture.Globalize.calendar.patterns.F;
        else if (String.compare(pzFormat, 'g') == 0)
            return wjc.culture.Globalize.calendar.patterns.g;
        else if (String.compare(pzFormat, 'G') == 0)
            return wjc.culture.Globalize.calendar.patterns.G;
        else if (String.compare(pzFormat, 'M') == 0)
            return wjc.culture.Globalize.calendar.patterns.M;
        else if (String.compare(pzFormat, 't') == 0)
            return wjc.culture.Globalize.calendar.patterns.t;
        else if (String.compare(pzFormat, 'T') == 0)
            return wjc.culture.Globalize.calendar.patterns.T;
        else if (String.compare(pzFormat, 'Y') == 0)
            return wjc.culture.Globalize.calendar.patterns.Y;
        else return pzFormat;
    }

    public static getFormatNumericPattern(pzFormat: string) {
        if (pzFormat.includes('#,##')) {
            let _nDecCount = 0;
            let _nPos = pzFormat.indexOf('0.');
            if (_nPos >= 0) {
                for (let _i = _nPos + 2; _i < pzFormat.length; _i++) {
                    if (pzFormat[_i] == '0') _nDecCount++;
                    else break;
                }
            }

            return String.format('N{0}', _nDecCount);
        }

        if (pzFormat.includes('#%')) {
            let _nDecCount = 0;
            let _nPos = pzFormat.indexOf('0.');
            if (_nPos >= 0) {
                for (let _i = _nPos + 2; _i < pzFormat.length; _i++) {
                    if (pzFormat[_i] == '#') _nDecCount++;
                    else break;
                }
            }

            return String.format('P{0}', _nDecCount);
        }

        return pzFormat;
    }

    public static sqlDatePartsRegions = {
        en: [
            'M/d/yyyy',
            'M/d/yy',
            'MM/dd/yy',
            'MM/dd/yyyy',
            'yy/MM/dd',
            'yy-MM-dd',
            'dd-MMM-yy',
            'dd-MMM-yyyy',
            'dd MMM yyyy',
            'dddd, MMMM d, yyyy',
            'MMMM d, yyyy',
            'dddd, d MMMM, yyyy',
            'd MMMM, yyyy',
            'h:mm tt',
            'hh:mm tt',
            'H:mm',
            'HH:mm',
            'h:mm:ss tt',
            'hh:mm:ss tt',
            'H:mm:ss',
            'HH:mm:ss',
            'MMM dd yyyy hh:mm:ss.fff',
            'yyyy-MM-dd hh:mm:ss.fff',
            'MMM dd yyyy hh:mm tt',
            'MMM dd yyyy hh:mm:ss:fff tt',
            'dd MMM yyyy hh:mm:ss tt',
            'MM/yy',
            'MM/yyyy',
            'yyyy/MM'
        ],
        vi: [
            'dd/MM/yyyy',
            'dd/MM/yy',
            'dd-MM-yy',
            'dd-MM-yyyy',
            'yyyy-MM-dd',
            'dd MMMM yyyy',
            'dddd, d MMMM, yyyy',
            'dd.MM.yy',
            'dd.MM.yyyy',
            'h:mm tt',
            'hh:mm tt',
            'H:mm',
            'HH:mm',
            'h:mm:ss tt',
            'hh:mm:ss tt',
            'H:mm:ss',
            'HH:mm:ss',
            'dd/MM/yyyy hh:mm:ss tt',
            'dd/MM/yyyy h:mm tt',
            'dd-MM-yy hh:mm:ss tt',
            'dd-MM-yyyy h:mm tt',
            'MM/yy',
            'MM/yyyy',
            'yyyy/MM',
            'dd MMM yyyy hh:mm:ss tt'
        ],
        ja: [
            'yyyy/MM/dd',
            'yy/MM/dd',
            'yy/M/d',
            'yyyy/M/d',
            'yyyy-MM-dd',
            'tt h:mm',
            'tt hh:mm',
            'H:mm',
            'HH:mm',
            'tt h:mm',
            'tt hh:mm:ss',
            'H:mm:ss',
            'HH:mm:ss',
            'yyyy-MM-dd hh:mm:ss',
            'yyyy-MM-dd hh:mm:ss.fff',
            'MM/yy',
            'MM/yyyy',
            'yyyy/MM',
            'dd MMM yyyy hh:mm:ss tt'
        ],
        ko: [
            'yyyy-MM-dd',
            'yy-MM-dd',
            'yy-M-d',
            'yyyy-M-d',
            'tt h:mm',
            'tt hh:mm',
            'H:mm',
            'HH:mm',
            'tt h:mm',
            'tt hh:mm:ss',
            'H:mm:ss',
            'HH:mm:ss',
            'yyyy-MM-dd hh:mm:ss',
            'yyyy-MM-dd hh:mm:ss.fff',
            'MM/yy',
            'MM/yyyy',
            'yyyy/MM',
            'dd MMM yyyy hh:mm:ss tt'
        ],
        cn: [
            'yyyy/M/d',
            'yyyy/MM/dd',
            'yyyy-MM-dd',
            'tt h:mm',
            'tt hh:mm',
            'H:mm',
            'HH:mm',
            'tt h:mm',
            'tt hh:mm:ss',
            'H:mm:ss',
            'HH:mm:ss',
            'yyyy-MM-dd hh:mm:ss',
            'yyyy-MM-dd hh:mm:ss.fff',
            'MM/yy',
            'MM/yyyy',
            'yyyy/MM',
            'dd MMM yyyy hh:mm:ss tt'
        ]
    };

    public static sqlDateParts = [
        'MMM dd yyyy hh:mm:ss.fff',
        'MMM dd yyyy hh:mm tt',
        'MMM dd yyyy',
        'dd MMM yyyy hh:mm:ss tt',
        'MM/dd/yy',
        'MM/dd/yyyy',
        'yy.MM.dd',
        'yyyy.MM.dd',
        'dd/MM/yy',
        'dd/MM/yyyy',
        'dd/MM/yyyy hh:mm:ss tt',
        'dd/MM/yyyy h:mm tt',
        'dd.MM.yy',
        'dd.MM.yyyy',
        'dd-MM-yy',
        'dd-MM-yyyy',
        'dd MMM yy',
        'dd MMM yyyy',
        'MMM dd, yy',
        'MMM dd, yyyy',
        'hh:mm:ss',
        'MMM dd yyyy hh:mm:ss:fff tt',
        'MM-dd-yy',
        'MM-dd-yyyy',
        'yy/MM/dd',
        'yyyy/MM/dd',
        'yyMMdd',
        'yyyyMMdd',
        'dd MMM yyyy hh:mm:ss:fff',
        'hh:mm:ss:fff',
        'yyyy-MM-dd hh:mm:ss',
        'yyyy-MM-dd hh:mm:ss.fff',
        'MM/dd/yy hh:mm:ss tt',
        'yyyy-MM-dd',
        'HH:mm',
        'MM/yy',
        'MM/yyyy',
        'yyyy/MM'
    ];
}
