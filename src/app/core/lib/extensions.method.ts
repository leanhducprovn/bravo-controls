import { BravoCulture } from "./bravo.culture";
import * as wjc from "@grapecity/wijmo";
import { DatePartEnum, TypeCode } from "./enums";
import { CryptoExtension } from './crypto.extension';
import { httpRequest, isoStringToDate, ObjectValues } from './bravo.core.function';
import { StringBuilder } from './data/string.builder';
import { RTFJS } from 'rtf.js';
import { HttpErrorResponse } from '@angular/common/http';
import { Encoding } from './encoding';
import { Resources } from "./resources";
import { SqlException } from "./exception/sql.exception";
import { DBConcurrencyException } from "./exception/db.concurrency.exception";
import { OperationCanceledException } from "./bravo.cancellation.token";
import { SecurityTokenExpiredException } from "./exception/security.token.expired.exception";
import { SecurityTokenException } from "./exception/security.token.exception";
import { Convert } from "./convert";
import { BravoDataTypeConverter } from "./bravo.datatype.converter";
import * as customFormat_ from 'clr-format';
const stringFormat = customFormat_;

const SqlExceptionName = 'SqlException';
const DBConcurrencyExceptionName = 'DBConcurrencyException';
const OperationCanceledExceptionName = 'OperationCanceledException';
const SecurityTokenExpiredExceptionName = 'SecurityTokenExpiredException';
const SecurityTokenExceptionName = 'SecurityTokenException';

// @dynamic
export class ExtensionsMethod {
    public static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    public static round(value: number, digits: number) {
        if (digits >= 0)
            return value.round(digits);

        digits = Math.abs(digits);
        let _temp = value / Math.pow(10, digits);
        _temp = _temp.round(0);
        return _temp * Math.pow(10, digits);
    }

    public static getTempName(): string {
        return `_${Math.random().toString(36).substring(7)}`;
    }

    public static isHttpsProtocol(pzUrl: string) {
        return /https:\/\//.test(pzUrl);
    }

    public static sortBy(pzItemName: string, pValue1: any, pValue2: any, reverse: boolean = false) {
        let _val1 = wjc.tryCast(pValue1, 'IWebDataRow') ? pValue1.getValue(pzItemName) : pValue1[pzItemName],
            _val2 = wjc.tryCast(pValue2, 'IWebDataRow') ? pValue2.getValue(pzItemName) : pValue2[pzItemName];

        let _sign = !reverse ? 1 : -1;

        if (Date.isDate(_val1) && Date.isDate(_val2)) {
            let _dateA = Date.asDate(_val1).getTime();
            let _dateB = Date.asDate(_val2).getTime();

            return _dateA > _dateB ? _sign * 1 : _sign * -1;
        }
        else if (typeof (_val1) == 'string' && typeof (_val2) == 'string') {
            return _sign * _val1.localeCompare(_val2);
        }
        else {
            if (_val1 < _val2) return _sign * -1;
            if (_val1 > _val2) return _sign * 1;
            return 0;
        }
    }

    public static containsProperty(enumType: any, value: any): any {
        for (const key in enumType) {
            if (key == value || (wjc.isString(key) && wjc.isString(value) && key.toLowerCase() == value.toLowerCase()))
                return key;
        }

        return null;
    }

    public static parseExceptionFromServer(pException): any {
        if (pException instanceof Error)
            return pException.message;

        if (!pException || !pException.error) return pException;

        if (pException instanceof HttpErrorResponse)
            return wjc.isString(pException.error) ? pException.error : pException.message;

        let _zError: string;
        if (wjc.isString(pException.error))
            _zError = pException.error;
        else if (pException.error instanceof ArrayBuffer)
            _zError = Encoding.UTF8.getString(new Uint8Array(pException.error));

        let _zErrorMessage: any,
            _parser = new DOMParser(),
            _xmlDoc = _parser.parseFromString(_zError, 'text/xml');

        if (_xmlDoc) {
            let _errors = _xmlDoc.querySelectorAll('Message');
            if (_errors) {
                for (let _n = 0; _n < _errors.length; _n++) {
                    if (!_zErrorMessage || _zErrorMessage.length <= 0)
                        _zErrorMessage = _errors.item(_n).innerHTML;
                    else
                        _zErrorMessage += '\n' + _errors.item(_n).innerHTML;
                }
            }

            if (!_zErrorMessage) {
                let _content = _xmlDoc.getElementById('content');
                if (_content) {
                    if (_content.children.length > 1)
                        _zErrorMessage = _content.children.item(1).textContent;
                }
                else {
                    let _error: any = _xmlDoc.getElementsByTagName('parsererror');
                    if (_error && _error.length > 0) {
                        _error = _error.item(0);
                        if (_error instanceof HTMLElement) {
                            _zErrorMessage = document.createElement('div');
                            _zErrorMessage.innerHTML = _error.innerHTML;

                            // wjc.setCss(_zErrorMessage, _error.style);
                        }
                    }
                }
            }
        }

        return _zErrorMessage;
    }

    public static handleException(pError: Error) {
        if (pError instanceof DOMException)
            return new Error(pError.message);
    }

    public static convertException(pzException: string) {
        let _parser = new DOMParser(),
            _xmlDoc = _parser.parseFromString(pzException, 'text/xml');

        let _eCode = _xmlDoc.querySelector('Code');
        if (_eCode) {
            let _eCodeValue = _eCode.querySelector('Value');
            if (_eCodeValue && !String.isNullOrEmpty(_eCodeValue.textContent)) {
                let _zMessage = ExtensionsMethod.getMessageError(_xmlDoc);
                let _zCode = _eCodeValue.textContent;

                switch (true) {
                    case _zCode.includes(DBConcurrencyExceptionName):
                        return new DBConcurrencyException(_zMessage);

                    case _zCode.includes(OperationCanceledExceptionName):
                        return new OperationCanceledException(_zMessage);

                    case _zCode.includes(SqlExceptionName):
                        return new SqlException(_zMessage);

                    case _zCode.includes(SecurityTokenExpiredExceptionName):
                        return new SecurityTokenExpiredException(_zMessage);

                    case _zCode.includes(SecurityTokenExceptionName):
                        return new SecurityTokenException(_zMessage);

                    default: {
                        return new Error(_zMessage);
                    }
                }
            }
        }

        return new Error(pzException);
    }

    public static getMessageError(pXmlDoc: Document) {
        if (pXmlDoc == null) return;

        let _zErrorMessage: string;
        let _errors = pXmlDoc.querySelectorAll('Message');
        if (_errors) {
            for (let _n = 0; _n < _errors.length; _n++) {
                if (!_zErrorMessage || _zErrorMessage.length <= 0)
                    _zErrorMessage = _errors.item(_n).innerHTML;
                else
                    _zErrorMessage += '\n' + _errors.item(_n).innerHTML;
            }
        }

        if (!_zErrorMessage) {
            let _content = pXmlDoc.getElementById('content');
            if (_content) {
                if (_content.children.length > 1)
                    _zErrorMessage = _content.children.item(1).textContent;
            }
            else {
                let _error: any = pXmlDoc.getElementsByTagName('parsererror');
                if (_error && _error.length > 0) {
                    _error = _error.item(0);
                    if (_error instanceof HTMLElement) {
                        _zErrorMessage = _error.innerHTML;
                    }
                }
            }
        }

        return _zErrorMessage;
    }

    public static renderImage(imageName: string, extensionName: string = 'png', base64?: any,
        width: number = -1, height: number = -1): HTMLElement {
        if (!imageName && !base64) return document.createElement('img');

        let _imgElement: HTMLElement = null;
        const _bIconWeb = imageName && imageName.startsWith('web-')

        if (!String.isNullOrEmpty(imageName)) {
            if (_bIconWeb) {
                _imgElement = document.createElement('i');
                _imgElement.style.textAlign = 'center';
                _imgElement.classList.add('fa', `fa-${imageName.substring(4)}`);
            }
            else {
                let _zUrlImg: string;
                if (imageName.includes('.'))
                    _zUrlImg = imageName;
                else
                    _zUrlImg = `${imageName}.${extensionName}`;

                _imgElement = document.createElement('img');
                if (_imgElement instanceof HTMLImageElement) {
                    _imgElement.src = `${location.origin}/assets/img/${_zUrlImg}`;
                    _imgElement.alt = wjc.isFirefox() ? ' ' : '';
                }
            }
        }
        else if (base64 != null) {
            let _zImgContent = base64;
            if (base64 instanceof Uint8Array)
                _zImgContent = Convert.toBase64String(base64);

            _imgElement = document.createElement('img');
            if (_imgElement instanceof HTMLImageElement) {
                let _imageData = String.format("data:image/{0};base64,{1}", extensionName, _zImgContent);

                /* let _buff = ArrayBufferBase64.decode(base64);
                let _blob = new Blob([_buff], { type: `image/${extensionName}` });
                let _url = URL.createObjectURL(_blob); */
                _imgElement.src = _imageData;
            }
        }

        if (width != -1) {
            if (wjc.isFirefox()) {
                _imgElement.style.maxWidth = width + 'px';
                _imgElement.style.width = width + 'px';
            }
            else {
                _imgElement.style.maxWidth = width + 'px';
            }

            if (_bIconWeb)
                _imgElement.style.fontSize = width + 'px';
        }

        if (height != -1) {
            _imgElement.style.height = height + 'px';
        }

        /* if (!_bIconWeb) {
            const _nRatio = (1 / devicePixelRatio);
            wjc.setCss(_imgElement, { transform: `scale(${_nRatio})` });
        } */

        return _imgElement;
    }

    public static getExtension(filename: string) {
        return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    }

    public static deserializebase64(base64: string, pbAllowCache: boolean = true) {
        const _zKey = CryptoExtension.sha256(base64);

        if (pbAllowCache && this._cacheRtf.has(_zKey))
            return this._cacheRtf.get(_zKey);

        const xhr = httpRequest('https://bravo8.bravo.com.vn/api/helper/deserializebase64', {
            method: 'POST',
            async: false,
            data: JSON.stringify(base64),
            contentType: 'application/json'
        });

        if (xhr.responseText) {
            const _zValue = xhr.responseText.trimChars('"');

            if (pbAllowCache)
                this._cacheRtf.set(_zKey, _zValue);

            return _zValue;
        }
    }

    public static sendMail(body: any) {
        if (!body) return 'No data';

        let xhr = httpRequest('https://bravo8.bravo.com.vn/api/helper/sendmail', {
            method: 'POST',
            async: false,
            data: JSON.stringify(body),
            contentType: 'application/json'
        });

        return xhr.responseText.trimChars('"');
    }

    private static _cacheRtf: Map<string, any> = new Map();
    private static _cacheHtml: Map<string, any> = new Map();

    public static rtfRenderer(pzContent: string) {
        const _key = CryptoExtension.sha256(pzContent);

        if (this._cacheRtf.has(_key))
            return this._cacheRtf.get(_key);

        RTFJS.loggingEnabled(false);

        const _rtfDoc = new RTFJS.Document(Encoding.UTF8.getBytes(pzContent), null);

        this._cacheRtf.set(_key, _rtfDoc.render());

        return this._cacheRtf.get(_key);
    }

    public static rtfToHtml(pzContent: string, cell: HTMLElement) {
        const _key = CryptoExtension.sha256(pzContent);

        if (this._cacheHtml.has(_key)) {
            const _html = this._cacheHtml.get(_key);

            this.setRtfCellContentHtml(_html, cell);
            return;
        }

        this.rtfRenderer(pzContent).then((html) => {
            this.setRtfCellContentHtml(html, cell);
            this._cacheHtml.set(_key, html);
        }).catch(error => console.error(error));
    }

    public static setRtfCellContentHtml(pzHtml: HTMLElement[], cell?: HTMLElement) {
        let _content = new StringBuilder();

        if (pzHtml.length > 0)
            for (let _item of pzHtml)
                _content.append(_item.outerHTML.toString());

        if (_content.length > 0 && cell)
            cell.innerHTML = _content.toString();

        return _content.toString();
    }

    public static getTextContentHtml(pzHtml: HTMLElement[]) {
        let _zText = new StringBuilder();

        if (pzHtml.length > 0)
            for (let _item of pzHtml)
                _zText.append(_item.innerText);

        if (_zText.length > 0)
            return _zText.toString();

        return '';
    }

    public static tableToDiv(html: string) {
        let _text = html;
        let _result = '';
        let _m = _text.match(/rowspan=\"(\d+)\"/g);
        let _sIndex = 0;
        let _styleName = ExtensionsMethod.getTempName();
        _text = _text.replace("rep-table", "rep-table" + _styleName);
        _text = _text.replace("rep-content", "rep-content" + _styleName);
        _text = _text.replace("rep-row", "rep-row" + _styleName);
        _text = _text.replace("rep-cell", "rep-cell" + _styleName);
        if (_m && _m.length > 0)
            for (let _n = 0; _n < _m.length; _n++) {
                let _indexStyleName = (_n + 1) + _styleName;
                let _matchIndex = _text.indexOf(_m[_n], _sIndex);
                _matchIndex = _text.lastIndexOf('<td', _matchIndex);
                let _endMatchIndex = _text.indexOf('</td>', _matchIndex) + 5;
                let _matchValue = _text.substring(_matchIndex, _endMatchIndex);
                let _count = _matchValue.match(/rowspan=\"(\d+)\"/)[1];
                // let _tmp = _text.substring(_sIndex, _matchIndex - 1);
                let _rowIndex = _text.lastIndexOf('<tr', _matchIndex - 1);
                let _rowHtml = _text.substring(_rowIndex, _text.indexOf('>', _rowIndex) + 1);
                // if (_n > 0) {
                //     // _result += _text.substring(_sIndex, _rowIndex - 1);
                //     console.log('____n',_n,_text.substring(_sIndex, _rowIndex - 1))
                // }
                _result += _text.substring(_sIndex, _rowIndex - 1);
                let _value = _matchValue.replace('<td', '<div class="rep-cell rep-cell-merge"');
                _value = _value.replace('td>', 'div>');
                _result = _result.replace("merge-" + (_n + 1), "merge-" + _indexStyleName);
                _result += "\r<div class=\"rep-row\">\r" + _value + "<div class=\"rep-content rep-cell-merge merge-" + _indexStyleName + "\">\n";
                _result += _rowHtml;
                let _endMergeIndex = _matchIndex;
                for (let _r = 0; _r < Number(_count); _r++) {
                    _endMergeIndex = _text.indexOf('tr>', _endMergeIndex) + 3;
                }
                _sIndex = _matchIndex + _matchValue.length;
                _result += _text.substring(_matchIndex + _matchValue.length, _endMergeIndex + 3) + '</div>\n</div>';
                _sIndex = _endMergeIndex + 1;
            }
        _result += _text.substring(_sIndex);
        _result = _result.replace(/<table/gi, "<div class=\"rep-table rep-table" + _styleName + "\"");
        _result = _result.replace(/table>/gi, 'div>');
        _result = _result.replace(/<thead/gi, "<div class=\"rep-content rep-content" + _styleName + "\"");
        _result = _result.replace(/thead>/gi, 'div>');
        _result = _result.replace(/<tbody/gi, "<div class=\"rep-content rep-content" + _styleName + "\"");
        _result = _result.replace(/tbody>/gi, 'div>');
        _result = _result.replace(/<tr/gi, "<div class=\"rep-row rep-row" + _styleName + "\"");
        _result = _result.replace(/tr>/gi, 'div>');
        _result = _result.replace(/<td/gi, "<div class=\"rep-cell rep-cell" + _styleName + "\"");
        _result = _result.replace(/td>/gi, 'div>');
        return _result;
    }

    public static EnumGetValues(value: any): Array<any> {
        if (value) {
            return ObjectValues(value).filter((_item) => !wjc.isString(_item));
        }
        return null;
    }

    /* public static rtfToHtml2(pzContent) {
       if (String.isNullOrEmpty(pzContent))
          return String.empty;
 
       let xhr = httpRequest('http://bravo8.bravo.com.vn/api/helper/asposertf', {
          method: 'POST',
          async: false,
          data: JSON.stringify(pzContent),
          contentType: 'application/json'
       });
 
       return xhr.responseText;
    } */

    public static renderLink(componentName: string, commandKey: string, text: string): HTMLElement {
        if (!componentName && !commandKey)
            return null;

        let _anchorElement = document.createElement('a');
        _anchorElement.classList.add('bravo-tool-strip-redirect');
        _anchorElement.innerHTML = `<div>${text}</div>`;
        _anchorElement.href = `#/${componentName ? componentName.toLowerCase() + '/' : ''}view/${commandKey}`;

        return _anchorElement;
    }

    public static addHighlightText(pElement: HTMLElement, pnIndex: number, pnLeng: number, cssClasName?: string) {
        if (pnIndex == null || pnIndex < 0)
            return;

        let _zText = pElement.innerText;
        let _zHighlightText = _zText.substr(pnIndex, pnLeng);

        let _newInnerText = _zText.replace(new RegExp(_zHighlightText, 'gi'), (match, expr) => {
            if (cssClasName) {
                return String.format("<span class='{0}'>{1}</span>", cssClasName, match);
            } else {
                return String.format("<span style='background:yellow;'>{0}</span>", match);
            }
        });
        pElement.innerHTML = pElement.innerHTML.replace(_zText, _newInnerText);
    }

    public static isRtfString(pzText: string) {
        return !String.isNullOrEmpty(pzText) && pzText.startsWith(`{\\rtf`);
    }

    public static toRoman(pnNumber: number) {
        if (pnNumber < 0 || pnNumber > 3999)
            throw new Error(String.format("Value must be in the range 0 - {0}", 3999));

        if (pnNumber == 0) return "N";

        let _values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        let _numerals = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

        let _sb = new StringBuilder();

        for (let _i = 0; _i < 13; _i++) {
            while (pnNumber >= _values[_i]) {
                pnNumber -= _values[_i];
                _sb.append(_numerals[_i]);
            }
        }

        return _sb.toString();
    }

    public static significantFigures(pNum: number, pSign: number) {
        let mult = Math.pow(10, pSign - Math.floor(Math.log(pNum) / Math.LN10) - 1);

        if (pSign <= 15 && mult >= 0.1)
            return Math.round(pNum * mult) / mult;

        return Math.floor(pNum * mult) / mult;
    }

    public static guessImageMime(data) {
        if (!data) return '';
        if (data.charAt(0) == '/') {
            return "jpeg";
        } else if (data.charAt(0) == 'R') {
            return "gif";
        } else if (data.charAt(0) == 'i') {
            return "png";
        }
    }

    public static convertNumberToColor(num): string {
        num >>>= 0;
        let b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16,
            a = ((num & 0xFF000000) >>> 24) / 255;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    }

    public static numberToVietnamese(num, customCharacter) {

        let string = num.toString(),
            units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

        let and = customCharacter || '';

        /* Is number zero? */
        if (parseInt(string) === 0) {
            return 'không';
        }

        /* Array of units as words */
        units = ['', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai', 'Mười Ba', 'Mười Bốn', 'Mười Lăm', 'Mười Sáu', 'Mười Bảy', 'Mười Tám', 'Mười Chín'];

        /* Array of tens as words */
        tens = ['', '', 'Hai mươi', 'Ba mươi', 'Bốn mươi', 'Năm mươi', 'Sáu mươi', 'Bảy mươi', 'Tám mươi', 'Chín mươi'];

        /* Array of scales as words */
        scales = ['', 'ngàn', 'triệu', 'tỷ', 'ngàn tỷ'];

        /* Split user arguemnt into 3 digit chunks from right to left */
        start = string.length;
        chunks = [];
        while (start > 0) {
            end = start;
            chunks.push(string.slice((start = Math.max(0, start - 3)), end));
        }

        /* Check if function has enough scale words to be able to stringify the user argument */
        chunksLen = chunks.length;
        if (chunksLen > scales.length) {
            return '';
        }

        /* Stringify each integer in each chunk */
        words = [];
        for (i = 0; i < chunksLen; i++) {

            chunk = parseInt(chunks[i]);

            if (chunk) {

                /* Split chunk into array of individual integers */
                ints = chunks[i].split('').reverse().map(parseFloat);

                /* If tens integer is 1, i.e. 10, then add 10 to units integer */
                if (ints[1] === 1) {
                    ints[0] += 10;
                }

                /* Add scale word if chunk is not zero and array item exists */
                if ((word = scales[i])) {
                    words.push(word);
                }

                /* Add unit word if array item exists */
                if ((word = units[ints[0]])) {
                    words.push(word);
                }

                /* Add tens word if array item exists */
                if ((word = tens[ints[1]])) {
                    words.push(word);
                }

                /* Add 'and' string after units or tens integer if: */
                if (ints[0] || ints[1]) {

                    /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                    if (ints[2] || !i && chunksLen) {
                        words.push(and);
                    }

                }

                /* Add hundreds word if array item exists */
                if ((word = units[ints[2]])) {
                    words.push(word + ' trăm');
                }
            }
        }

        return words.reverse().join(' ');
    }
}

export class Char {
    public static isLetter(str: string): boolean {
        return (str.charCodeAt(0) >= 65 && str.charCodeAt(0) <= 90) ||
            (str.charCodeAt(0) >= 97 && str.charCodeAt(0) <= 122)
    }

    public static isDigit(str): boolean {
        return Number.isNumber(str);
    }

    public static isLower(str: string): boolean {
        return str == str.toLowerCase() && str != str.toUpperCase();
    }

    public static isUpper(str: string): boolean {
        return str == str.toUpperCase() && str != str.toLowerCase();
    }

    public static isLetterOrDigit(str) {
        return this.isLetter(str) || Number.isNumber(str);
    }
}

declare global {
    interface StringConstructor {
        format(text: string, ...args: any[]): string;
        isNullOrEmpty(text: string): boolean;
        removeAccent(text: string): string;
        asString(value): string;
        isBase64(value): boolean;
        compare(value: string, value1: string, options?: SensitivityEnum): number;
        empty: string;
        includeNewLine(text: string): boolean;
    }

    interface DateConstructor {
        year;
        month;
        date;
        defaultFormat: string;
        minValue: Date;
        isDate(value): boolean;
        asDate(value): Date;
        dateAdd(datePart: DatePartEnum, num: number, date: any): Date;
        dateDiff(datePart: DatePartEnum, startDate: any, end: any): Number;
        fromBinary(value: number): Date;
    }

    interface ObjectConstructor {
        compare(value0: any, value1: any);
    }

    interface NumberConstructor {
        isNumber(value): boolean;
        asNumber(value): number;
    }

    interface BooleanConstructor {
        isBoolean(value): boolean;
        asBoolean(value): boolean;
        trueString: string;
        falseString: string;
    }

    interface String {
        trimStart(): string;
        trimEnd(c?: string): string;
        trimChars(...c: string[]): string;
        stuff(start: number, length: number, str: string): string;
        removeAccent(): string;
        right(num: number): string;
        left(num: number): string;
        insert(index: number, value: string);
        remove(startIndex: number, length: number);
        firstLowerCase();
        capitalizeTitle();
        capitalizeFirstLetter();
        toValidFileName(): string;
        isASCII(): boolean;
        indexOfAny(anyOf: Array<string>, startIndex?: number, count?: number): number;
        indexOfUnicode(searchString: string, position?: number): number;
        toUnicode(): string;
        isUnicode(): boolean;
        isHTML(): boolean;
    }

    interface Number {
        str(length: number, scale: number);
        round(places): number;
    }

    interface Array<T> {
        clear();
        expect(items: Array<T>);
        intersect(...items: Array<T>): Array<T>;
        clone(): Array<T>;
        peek();
        //remove(item: T);
        // removeAt(index: number);
    }

    interface Date {
        date(): Date;
        dateUTC(): Date;
        toUniversalTime(): Date;
        toLocalTime(): Date;
        toLocalTime1(): Date;
        day(): number;
        month(): number;
        year(): number;
        dayOfYear(): number;
        addMonths(value: number): Date;
        addDays(value: number): Date;
        add(value: number): Date;
        addSeconds(value: number): Date;
        addMiliSeconds(value: number): Date;
        toLocaleStringWidthFormat(format?: string): string;
        toBinary();
    }
}

String.prototype.insert = function (index, value) {
    if (index > 0)
        return this.substring(0, index) + value + this.substring(index, this.length);
    else
        return value + this;
}

String.prototype.remove = function (startIndex, length) {
    return this.substr(0, startIndex) + this.substr(startIndex + length);
}

String.prototype.right = function (num: number): string {
    return this.substr(this.length, Math.min(this.length, num));
}

String.prototype.left = function (num: number): string {
    return this.substr(0, Math.min(this.length, num));
}

String.prototype.trimStart = function () {
    return this.replace(/^\s+/, "");
}

String.prototype.trimEnd = function (c?: string) {
    if (!c) {
        return this.replace(/ +$/, "");
    }
    else {
        if (this.endsWith(c)) {
            let _nPos = this.lastIndexOf(c);
            if (_nPos > 0) return this.substring(0, _nPos);
        }
    }

    return this;
}

String.prototype.toValidFileName = function (): string {
    return this.replace(/[/\\?%*:|"<>]/g, "");
}

String.empty = '';

String.prototype.removeAccent = function () {
    return this.normalize("NFKD")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[\u0300-\u036f]/g, "");
}

String.prototype.toUnicode = function () {
    let _result: string = "";

    for (let i = 0; i < this.length; i++) {
        let _partial = this[i].charCodeAt(0).toString(16);

        while (_partial.length !== 4)
            _partial = "0" + _partial;

        _result += "\\u" + _partial;
    }

    return _result;
};

String.prototype.isUnicode = function () {
    const str = this;
    for (let i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt(i) > 255) { return true; }
    }
    return false;
}

String.prototype.stuff = function (start: number, length: number, str: string): string {
    let strSource = this.substring(start, start + length);
    let rs = this.replace(strSource, str);

    return rs;
}

String.prototype.firstLowerCase = function () {
    return this.substring(0, 1).toLowerCase() + this.substring(1);
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalizeTitle = function () {
    let _zWords = this.split(' ');
    _zWords = _zWords.map((word) => {
        let _first = word.charAt(0).toUpperCase();
        word = _first.concat(word.slice(1));
        return word;
    });

    return _zWords.join(' ');
}

String.prototype.isASCII = function () {
    let _str = this as string;
    return /^[\x00-\x7F]*$/.test(_str);
}

String.prototype.isHTML = function () {
    let str = this;
    try {
        const fragment = new DOMParser().parseFromString(str, "text/html");
        return fragment.body.children.length > 0
    } catch (error) { ; }
    return false;
}

String.prototype.indexOfAny = function (anyOf: Array<string>, startIndex?: number, count?: number) {
    let _str = this as string;
    if (startIndex == null)
        startIndex = 0;

    if (count == null)
        count = (_str.length - 1) - startIndex;

    _str = _str.substring(startIndex, startIndex + count);
    for (let _i = 0; _i < _str.length; _i++) {
        if (anyOf.includes(_str[_i])) {
            return startIndex + _i;
        }
    }

    return -1;
}

String.prototype.indexOfUnicode = function (searchString: string, position?: number) {
    let _z: string = this;
    return _z.normalize('NFKD').indexOf(searchString.normalize('NFKD'), position);
}

String.format = function (text, ...args: any[]) {
    return stringFormat(text, ...args);

    /* if (String.isNullOrEmpty(text))
        return String.empty;

    return text.replace(/{(\d+)}/g, function (match, number) {
        if (args[number] === undefined || args[number] == null)
            return '';

        return args[number];
    }); */
};

String.isNullOrEmpty = function (text): boolean {
    return text == null || text === "" || text === void 0;
}

String.includeNewLine = function (text: string): boolean {
    if (typeof (text) == 'string') {
        let _match = /\r|\n/.exec(text);
        return !_match ? false : true;
    }

    return false;
}

String.compare = function (value: string, value1: string, options: SensitivityEnum = SensitivityEnum.Variant): number {
    if (value == null && value1 == null)
        return 0;

    if (value == null) return -1;

    if (!wjc.isString(value))
        value = String.format("{0}", value);

    if (options == SensitivityEnum.Variant)
        return value.localeCompare(value1);

    return value.localeCompare(value1, BravoCulture.ci, { sensitivity: options });
}

export enum SensitivityEnum {
    Base = 'base',
    Accent = 'accent',
    Case = 'case',
    Variant = 'variant'
}

String.removeAccent = function (text) {
    return text.normalize('NFKD')
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[\u0300-\u036f]/g, "");
}

String.prototype.trimChars = function (...c: string[]) {
    if (c && c.length == 1) {
        var re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
        return this.replace(re, "");
    }

    if (c && c.length > 1) {
        let _rs = this;

        for (const _c of c)
            _rs = _rs.replace(new RegExp("^[" + _c + "]+|[" + _c + "]+$", "g"), "");

        return _rs;
    }
}

String.asString = function (value): string {
    if (typeof (value) === 'string') {
        return value;
    }
}

String.isBase64 = function (pzStr): boolean {
    if (!wjc.isString(pzStr) || pzStr == null || pzStr === '' || pzStr.trim() === '')
        return false;

    try {
        return btoa(atob(pzStr)) == pzStr;
    }
    catch (err) {
        return false;
    }
}

Array.prototype.clear = function () {
    while (this.length > 0) {
        this.pop();
    }
}

Array.prototype.expect = function (items) {
    return this.filter(x => !items.includes(x));
}

Array.prototype.intersect = function (...a): Array<any> {
    return this.filter(Set.prototype.has, new Set(a));
}

Array.prototype.clone = function () {
    return [...this];
}

Array.prototype.peek = function () {
    return this[this.length - 1];
}

/* Array.prototype.removeAt = function (index: number) {
    this.slice(index, 1);
}

Array.prototype.remove = function (item: any) {
    let _index = this.findIndex(it => it == item);
    if (_index > -1 && _index < this.length - 1)
        this.removeAt(_index);
} */

// const DatePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/;
const DatePattern = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
const DatePattern1 = /^(\d{4})-(\d{2})-(\d{2})$/;
// Error profile
// const DatePattern2 = /((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-|\ )((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-|\ )((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/;
const msecPerMinute = 1000 * 60;
const msecPerHour = msecPerMinute * 60;
const msecPerDay = msecPerHour * 24;

Date.isDate = function (value) {
    if (!value) return false;

    if (typeof value === 'string') {
        value = value.replace('  ', ' ');

        if (DatePattern.test(value) || DatePattern1.test(value)/*  || DatePattern2.test(value) */) {
            return true;
        }
    }
    else if (value instanceof Date) {
        return true;
    }

    return false;
}

Date.asDate = function (value) {
    if (!value) return null;

    if (value instanceof Date)
        return value;

    if (typeof value === 'string') {
        const _m = DatePattern.exec(value);
        if (_m) return isoStringToDate(_m);

        const _m1 = DatePattern1.exec(value);
        if (_m1) {
            let utcMilliseconds = Date.UTC(+_m1[1], +_m1[2] - 1, +_m1[3]);
            return new Date(utcMilliseconds);
        }
    }
}

Object.compare = function (value0: any, value1: any) {
    return isFinite(value0) && isFinite(value1) ?
        ((value0 > value1) as any) - ((value0 < value1) as any) : NaN;
}

Date.dateAdd = function (datePart: DatePartEnum, num: number, date: any): Date {
    let _dateClone = BravoDataTypeConverter.convertValue(date, TypeCode.DateTime); //Date.asDate(date);
    if (!(_dateClone instanceof Date))
        return new Date();

    let _date = new Date(_dateClone.getTime());

    switch (datePart) {
        case DatePartEnum.year:
        case DatePartEnum.yy:
        case DatePartEnum.yyyy: {
            _date.setFullYear(_date.getFullYear() + num);
            break;
        }

        case DatePartEnum.quarter:
        case DatePartEnum.qq:
        case DatePartEnum.q: {
            _date.setMonth(_date.getMonth() + num * 3);
            break;
        }

        case DatePartEnum.month:
        case DatePartEnum.mm:
        case DatePartEnum.m: {
            _date.setMonth(_date.getMonth() + num);
            break;
        }

        case DatePartEnum.dayofyear:
        case DatePartEnum.dy:
        case DatePartEnum.d:

        case DatePartEnum.weekday:
        case DatePartEnum.dw:

        case DatePartEnum.day:
        case DatePartEnum.dd:
        case DatePartEnum.d: {
            _date.setDate(_date.getDate() + num);
            break;
        }

        case DatePartEnum.week:
        case DatePartEnum.wk:
        case DatePartEnum.ww: {
            _date.setDate(_date.getDate() + num * 7);
            break;
        }

        case DatePartEnum.hour:
        case DatePartEnum.hh: {
            _date.setHours(_date.getHours() + num);
            break;
        }

        case DatePartEnum.minute:
        case DatePartEnum.mi:
        case DatePartEnum.n: {
            _date.setMinutes(_date.getMinutes() + num);
            break;
        }

        case DatePartEnum.second:
        case DatePartEnum.ss:
        case DatePartEnum.s: {
            _date.setSeconds(_date.getSeconds() + num);
            break;
        }

        case DatePartEnum.millisecond:
        case DatePartEnum.ms: {
            _date.setMilliseconds(_date.getMilliseconds() + num);
            break;
        }
    }

    if (_date instanceof Date) return _date;

    throw new Error(String.format(Resources.UnknownDatePart, datePart));
}

Date.dateDiff = function (datePart: DatePartEnum, startDate: any, endDate: any): Number {
    let _startDate = Date.asDate(startDate); //<Date>BravoDataTypeConverter.convertValue(startDate, TypeCode.DateTime);;
    let _endDate = Date.asDate(endDate); //<Date>BravoDataTypeConverter.convertValue(endDate, TypeCode.DateTime);;

    switch (datePart) {
        case DatePartEnum.year:
        case DatePartEnum.yy:
        case DatePartEnum.yyyy: {
            return _endDate.getFullYear() - _startDate.getFullYear();
        }

        case DatePartEnum.quarter:
        case DatePartEnum.qq:
        case DatePartEnum.q: {
            return (_endDate.getFullYear() - _startDate.getFullYear()) +
                (_endDate.getMonth() - 1) / 3 - (_startDate.getMonth() - 1) / 3;
        }

        case DatePartEnum.month:
        case DatePartEnum.mm:
        case DatePartEnum.m: {
            return (12 * _endDate.getFullYear() + _endDate.getMonth()) - (12 * _startDate.getFullYear() + _startDate.getMonth());
        }

        case DatePartEnum.dayofyear:
        case DatePartEnum.dy:
        case DatePartEnum.d:

        case DatePartEnum.weekday:
        case DatePartEnum.dw:

        case DatePartEnum.day:
        case DatePartEnum.dd:
        case DatePartEnum.d: {
            return Math.floor((_endDate.getTime() - _startDate.getTime()) / msecPerDay);
        }

        case DatePartEnum.week:
        case DatePartEnum.wk:
        case DatePartEnum.ww: {
            return Math.floor((_endDate.getTime() - _startDate.getTime()) / msecPerDay) / 7;
        }

        case DatePartEnum.hour:
        case DatePartEnum.hh: {
            return Math.floor((_endDate.getTime() - _startDate.getTime()) / msecPerHour);
        }

        case DatePartEnum.minute:
        case DatePartEnum.mi:
        case DatePartEnum.n: {
            return Math.floor((_endDate.getTime() - _startDate.getTime()) / msecPerMinute);
        }

        case DatePartEnum.second:
        case DatePartEnum.ss:
        case DatePartEnum.s: {
            return Math.floor((_endDate.getTime() - _startDate.getTime()) / 1000);
        }

        case DatePartEnum.millisecond:
        case DatePartEnum.ms: {
            return Math.floor((_endDate.getTime() - _startDate.getTime()));
        }
    }

    throw new Error(String.format(Resources.UnknownDatePart, datePart));
}

Date.defaultFormat = 'dd MMM yyyy hh:mm:ss tt';

Date.prototype.toLocaleStringWidthFormat = function (format?: string): string {
    if (!format)
        return wjc.Globalize.formatDate(this, Date.defaultFormat);
    else
        return wjc.Globalize.formatDate(this, format);
}

Date.prototype.toString = function (): string {
    return wjc.Globalize.formatDate(this, Date.defaultFormat);
}

Date.year = new Date().getFullYear();
Date.month = new Date().getMonth() + 1;
Date.date = new Date().getDate();

Date.minValue = new Date(1900, 0, 1);

Date.fromBinary = function (value: number): Date {
    let ticksToMicrotime = value / 10000;

    //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
    let epochMicrotimeDiff = Math.abs(new Date(0, 0, 1).setFullYear(1));

    //new date is ticks, converted to microtime, minus difference from epoch microtime
    let tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
    let _diffNum = getDiffDate(tickDate);

    return new Date(ticksToMicrotime - epochMicrotimeDiff + _diffNum);
}

Date.prototype.toBinary = function () {
    let now: Date = this;
    let _ticks_1970 = Math.abs(new Date(0, 0, 1).setFullYear(1));

    return (_ticks_1970 + now.getTime() - 400000) * 10000;
}

function getDiffDate(date: Date) {
    return (24 * 60 * 60 - (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds())) * 1000;
}

Date.prototype.date = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}

Date.prototype.dateUTC = function () {
    return this.toUniversalTime().date();
}

Date.prototype.toUniversalTime = function () {
    return new Date(this.getTime() + this.getTimezoneOffset() * 60000)
}

Date.prototype.toLocalTime = function () {
    let date: any = new Date(this);

    let localOffset = date.getTimezoneOffset() * 60000;
    let localTime = date.getTime();

    date = localTime - localOffset;
    date = new Date(date);

    return date;
}

Date.prototype.toLocalTime1 = function () {
    let date: any = new Date(this);

    let localOffset = date.getTimezoneOffset() * 60000;
    let localTime = date.getTime();

    date = localTime + localOffset;
    date = new Date(date);

    return date;
}

Date.prototype.day = function () {
    return this.getDate();
}

Date.prototype.month = function () {
    return this.getMonth() + 1;
}

Date.prototype.year = function () {
    return this.getFullYear();
}

Date.prototype.dayOfYear = function () {
    let yn = this.getFullYear();
    let mn = this.getMonth();
    let dn = this.getDate();
    let d1: any = new Date(yn, 0, 1, 12, 0, 0); // noon on Jan. 1
    let d2: any = new Date(yn, mn, dn, 12, 0, 0); // noon on input date
    let ddiff = Math.round((d2 - d1) / 864e5);
    return ddiff + 1;
};

Date.prototype.addMonths = function (value: number): Date {
    let _dt: Date = new Date(this.getTime());
    _dt.setMonth(_dt.getMonth() + value);
    return _dt;
}

Date.prototype.addDays = function (value: number): Date {
    let _dt: Date = new Date(this.getTime());
    _dt.setDate(_dt.getDate() + value);
    return _dt;
}

Date.prototype.add = function (value: number): Date {
    let _dt: Date = new Date(this.getTime() + Math.round(value));
    return _dt;
}

Date.prototype.addSeconds = function (value: number): Date {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(),
        this.getHours(), this.getMinutes(), this.getSeconds() + value);
}

Date.prototype.addMiliSeconds = function (value: number): Date {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(),
        this.getMinutes(), this.getSeconds(), this.getMilliseconds() + value);
}

Number.prototype.round = function (places: number) {
    return +(Math.round((this + "e+" + places) as any) + "e-" + places);
}

Number.prototype.str = function (length: number, scale: number) {
    let _n: number = this;
    if (scale > 0) {
        _n = this.round(scale);
    }

    let text = _n.toString();
    let arr = text.split('.');
    let intText: string;

    if (scale > 0) {
        let intLen = length - scale - 1;
        intText = arr[0].substring(Math.max(0, arr[0].length - intLen));

        if (arr.length > 1) {
            let decText = arr.length > 0 ? arr[1].substring(0, Math.min(scale, arr[1].length)) : String.empty;
            return intText.padStart(intLen, ' ') + '.' + decText.padEnd(scale, '0');
        }
        else {
            return intText.padStart(intLen, ' ') + "." + "".padEnd(scale, '0');
        }
    }

    intText = arr[0].substring(Math.max(0, arr[0].length - length));

    return intText.padStart(length, ' ');
}

Number.isNumber = function (value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

Number.asNumber = function (value): number {
    if (typeof (value) == 'number')
        return value;

    if (typeof (value) == 'string') {
        let _nVal = parseFloat(value);
        if (!isNaN(_nVal)) return _nVal;
    }
}

Boolean.asBoolean = function (value): boolean {
    if (value == true || value == "True" || value == Boolean.trueString || value == 1 || value == "1")
        return true;

    return false;
}

Boolean.isBoolean = function (value): boolean {
    if (typeof (value) == 'boolean' || value == 'True' || value == 'False' ||
        value == Boolean.trueString || value == Boolean.falseString)
        return true;

    return false;
}

Boolean.trueString = "true";
Boolean.falseString = "false";

