import { Injector, SecurityContext } from "@angular/core";
import { IKeyedCollection } from "./interface/IKeyedCollection";
import * as wjc from "@grapecity/wijmo";
import { BravoLangEnum } from "./enums";
import { BravoLayoutItem } from "./serializations/bravo.layout.item";
import { BravoClientSettings } from "./bravo.client.settings";
import { saveAs } from 'file-saver'
import { isTablet } from "./bravo.core.function";
import { ExtensionsMethod } from "./extensions.method";
import { BravoGlobalize } from "./bravo.globalize";
import { DomSanitizer } from "@angular/platform-browser";

export const DefaultColor = new wjc.Color('transparent');

const DateSqlPattern = /((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-|\ )((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-|\ )((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/;

// @dynamic
export class Padding {
    private _top: number;

    public get top(): number {
        return this._top;
    }

    public set top(value: number) {
        this._top = value;
    }

    private _right: number;

    public get right(): number {
        return this._right;
    }

    public set right(value: number) {
        this._right = value;
    }

    private _bottom: number;

    public get bottom(): number {
        return this._bottom;
    }

    public set bottom(value: number) {
        this._bottom = value;
    }

    private _left: number;

    public get left(): number {
        return this._left;
    }

    public set left(value: number) {
        this._left = value;
    }

    constructor(left = 0, top = 0, right = 0, bottom = 0) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    equals(pad: Padding): boolean {
        return (pad instanceof Padding) && this.top == pad.top && this.right == pad.right &&
            this.bottom == pad.bottom && this.left == pad.left;
    }

    clone(): Padding {
        return new Padding(this.left, this.top, this.right, this.bottom);
    }

    public get vertical(): number {
        return this.top + this.bottom;
    }

    public get horizontal(): number {
        return this.left + this.right;
    }

    public get hasValue(): boolean {
        return this.top != 0 || this.bottom != 0 || this.left != 0 || this.right != 0;
    }

    public static get empty(): Padding {
        return new Padding(0, 0, 0, 0);
    }

    toString() {
        return `${this.top}px ${this.right}px ${this.bottom}px ${this.left}px`;
    }
}

export const DefaultPadding = new Padding(0, 0, 0, 0);

export class KeyedCollection<T> implements IKeyedCollection<T>{
    private items: { [index: string]: T } = {};

    private _count: number = 0;

    public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public count(): number {
        return this._count;
    }

    public add(key: string, value: T) {
        if (!this.items.hasOwnProperty(key))
            this._count++;

        this.items[key] = value;
    }

    public remove(key: string): T {
        const val = this.items[key];
        delete this.items[key];
        this._count--;
        return val;
    }

    public item(key: string): T {
        return this.items[key];
    }

    public keys(): string[] {
        const keySet: string[] = [];

        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public values(): T[] {
        const values: T[] = [];

        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }
}

const languages: Object = {
    'vi': BravoLangEnum.Vietnamese,
    'en': BravoLangEnum.English,
    'ja': BravoLangEnum.Japanese,
    'zh': BravoLangEnum.Chinese,
    'ko': BravoLangEnum.Korean,
    'cus': BravoLangEnum.Custom
}

// @dynamic
export class BravoCore {
    /**
     * Return true if value != (null || undifined)
     * @param value 
     */
    public static isDefined(value: any): boolean {
        return typeof value !== 'undefined' && value !== null;
    }

    public static get rootKey(): string {
        return '0G8hTzpxEcM=';
    }

    public static readonly EmptyColor = wjc.Color.fromString('transparent');

    public static injector: Injector;

    public static convertLangToLCID(lang?: string) {
        if (!lang) {
            lang = window.navigator.languages ? window.navigator.languages[0] : null;
            lang = lang || window.navigator.language;
        }

        if (lang.indexOf('-') !== -1)
            lang = lang.split('-')[0];

        if (lang.indexOf('_') !== -1)
            lang = lang.split('_')[0];

        if (languages.hasOwnProperty(lang))
            return languages[lang];

        return BravoLangEnum.English;
    }

    public static convertLCIDToLang(id: number) {
        for (const key in languages) {
            if (languages.hasOwnProperty(key)) {
                const element = languages[key];
                if (element == id) return key;
            }
        }

        return 'en';
    }

    public static toCssString(css: any) {
        let _cssString = String.empty;
        for (let _key in css)
            _cssString += String.format("{0}:{1};", _key, css[_key]);

        return _cssString;
    }

    public static append(element: HTMLElement, contentHtml: any, pbClear: boolean = true) {
        if (pbClear) element.textContent = null;

        if (contentHtml instanceof HTMLElement) {
            element.append(contentHtml);
            return;
        }

        if (wjc.isString(contentHtml)) {
            let _content = document.createElement('div');
            _content.innerHTML = contentHtml;

            element.append(_content);
        }
    }

    public static convertPxStringToNumber(pzNum: string): number {
        if (String.isNullOrEmpty(pzNum))
            return 0;

        pzNum = pzNum.replace('px', '');
        if (Number.isNumber(pzNum))
            return Number.asNumber(pzNum);

        return 0;
    }

    private static _scrollBarSize: number;

    public static get scrollBarSize(): number {
        if (this._scrollBarSize == null)
            this._scrollBarSize = this.getScrollbarWidth();

        return this._scrollBarSize;
    }

    private static getScrollbarWidth() {

        // Creating invisible container
        const _outerDiv = document.createElement('div');
        _outerDiv.style.visibility = 'hidden';
        _outerDiv.style.overflow = 'scroll'; // forcing scrollbar to appear
        _outerDiv.style['msOverflowStyle'] = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(_outerDiv);

        // Creating inner element and placing it in the container
        const _innerDiv = document.createElement('div');
        _outerDiv.appendChild(_innerDiv);

        // Calculating difference between container's full width and the child width
        let _rectOuter = _outerDiv.getBoundingClientRect(),
            _rectInner = _innerDiv.getBoundingClientRect();

        // const _scrollbarWidth = (_outerDiv.offsetWidth - _innerDiv.offsetWidth);
        const _scrollbarWidth = (_rectOuter.width - _rectInner.width);

        // Removing temporary elements from the DOM
        _outerDiv.parentNode.removeChild(_outerDiv);

        return _scrollbarWidth;

    }

    public static getSerializableProperties(obj: any) {
        let arr = [];

        // travel up class hierarchy saving public properties that can be get/set.
        // NOTE: use getPrototypeOf instead of __proto__ for IE9 compatibility.
        for (obj = obj.prototype; obj != Object.prototype; obj = Object.getPrototypeOf(obj)) {
            let names = Object.getOwnPropertyNames(obj);
            for (let i = 0; i < names.length; i++) {
                let name = names[i],
                    pd = Object.getOwnPropertyDescriptor(obj, name);
                if (pd && pd.set && pd.get && name[0] != '_' &&
                    !name.match(/disabled|required/)) { // deprecated properties
                    arr.push(name);
                }
            }
        }

        // done
        return arr;
    }

    /* public static isDateSql(value) {
        if (Date.isDate(value)) {
            return true;
        }
        else {
            return DateSqlPattern.test(value);
        }
    } */

    public static getMobileOperatingSystem() {
        let userAgent = navigator.userAgent || navigator.vendor;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent))
            return "Windows Phone";

        if (/android/i.test(userAgent))
            return "Android";
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform))
            return "iOS";

        return "unknown";
    }

    public static getBrowsers() {
        if (navigator.userAgent.indexOf("FxiOS") > -1 || navigator.userAgent.indexOf('Firefox') > -1)
            return "Firefox";
        else if (navigator.userAgent.indexOf("CriOS") > -1 || navigator.userAgent.indexOf('Chrome') > -1)
            return "Chrome";
        else if ((navigator.userAgent.indexOf("CriOS") > -1 || navigator.userAgent.indexOf('Chrome')) > -1 && navigator.userAgent.indexOf("coc_coc") > -1)
            return "Chrome";
        else if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("FxiOS") < 0 && navigator.userAgent.indexOf("CriOs") < 0 && navigator.userAgent.indexOf('Chrome') < 0 && navigator.userAgent.indexOf('Firefox') < 0)
            return "Safari";
        else
            return "unknown";
    }

    public static saveBlobFile(fileName: string, blob: Blob, pbUsingBlobUrl: boolean = false) {
        let _os = this.getMobileOperatingSystem();
        let _browser = this.getBrowsers();

        if (_os == "iOS" && _browser != 'Safari') {
            let reader = new FileReader();
            (<any>reader).fileName = fileName;
            reader.onload = function (e) {
                window.location.href = reader.result.toString();
            }
            reader.readAsDataURL(blob);
        }
        else {
            if (pbUsingBlobUrl) {
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
            }
            else {
                saveAs(blob, fileName);
            }
        }
    }

    private static pattern = new RegExp("([^,]*),([^,]*),([^,]*),(.*)");

    public static convertBoundsToRect(pBounds: any) {
        if (pBounds instanceof wjc.Rect)
            return pBounds;

        if (wjc.isString(pBounds)) {
            let str = String.format("{0}", pBounds);
            let m = str.match(BravoCore.pattern);

            if (m.length > 4)
                return new wjc.Rect(Number.parseFloat(m[1]),
                    Number.parseFloat(m[2]),
                    Number.parseFloat(m[3]),
                    Number.parseFloat(m[4]));
        }
    }

    public static rectangleDeflate(pRect: wjc.Rect, pMargin: Padding) {
        pRect.left += pMargin.left;
        pRect.top += pMargin.top;
        pRect.width -= (pMargin.left + pMargin.right);
        pRect.height -= (pMargin.top + pMargin.bottom);

        return pRect;
    }

    public static dateConverterRegionText(pDate: Date, pOption: {}): string {
        let _zText = "";

        if (BravoClientSettings.currentLang == BravoLangEnum.Vietnamese) {
            _zText = pDate.toLocaleDateString('vi-VN', pOption);

            let indexMonthEnd = _zText.lastIndexOf(',');
            let indexMonthStart = _zText.indexOf('tháng');

            let _month: string = ExtensionsMethod.numberToVietnamese(_zText.substring(indexMonthStart, indexMonthEnd).replace('tháng ', ''), 'Tháng');

            _zText = _zText.stuff(indexMonthStart, indexMonthEnd - indexMonthStart, _month)
        }
        else if (BravoClientSettings.currentLang == BravoLangEnum.Japanese) {
            _zText = pDate.toLocaleDateString('ja-JP', pOption);
        }
        else if (BravoClientSettings.currentLang == BravoLangEnum.Chinese) {
            _zText = pDate.toLocaleDateString('zh-Hans', pOption);
        }
        else if (BravoClientSettings.currentLang == BravoLangEnum.Korean) {
            _zText = pDate.toLocaleDateString('ko-KR', pOption);
        }
        else {
            _zText = BravoGlobalize.format(pDate, 'D');
        }

        return _zText;
    }
}

export class Stopwatch {
    private time: number;
    private running: boolean;
    private times: Array<number>;

    public static startNew() {
        let _sw = new Stopwatch();
        _sw.start();

        return _sw;
    }

    constructor() {
        this.reset();
    }

    public get elapsed(): number {
        return this.time;
    }

    public get elapsedMilliseconds(): number {
        return Math.round(this.times[2] + this.times[1] * 60 + this.times[0] * 60 * 60) * 10;
    }

    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    stop() {
        this.running = false;
        this.time = null;
    }

    reset() {
        this.times = [0, 0, 0];
    }

    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        requestAnimationFrame(this.step.bind(this));
    }

    calculate(timestamp) {
        var diff = timestamp - this.time;

        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }

    print() {
        console.log(this.format(this.times));
    }

    format(times) {
        return `\
            ${pad0(times[0], 2)}:\
            ${pad0(times[1], 2)}:\
            ${pad0(Math.floor(times[2]), 2)}`;
    }
}

export function sanitizeHtml(pzHtml: string) {
    if (BravoCore.injector) {
        const _san = BravoCore.injector.get(DomSanitizer) as DomSanitizer;
        if (_san) return _san.sanitize(SecurityContext.HTML, pzHtml);
    }

    return wjc.escapeHtml(pzHtml);
}

export function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return ("0" + hrs).slice(-2) + ':' + ("0" + mins).slice(-2) + ':' + ("0" + secs).slice(-2) + '.' + ("0" + Math.floor(ms)).slice(-3);
}

export function getInfoBrowser() {
    let nAgt = navigator.userAgent;
    let browserName = navigator.appName;
    let fullVersion = '' + parseFloat(navigator.appVersion);
    let nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    else if ((verOffset = nAgt.indexOf('coc_coc_browser')) != -1) {
        browserName = "Cốc cốc";
        fullVersion = nAgt.substring(verOffset + 16);
    }
    else if ((verOffset = nAgt.indexOf('Edg')) != -1) {
        browserName = "Microsoft Edge";
        fullVersion = nAgt.substring(verOffset + 4);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1 || (verOffset = nAgt.indexOf("CriOS")) != -1) {
        browserName = "Chrome";
        const _i = nAgt.includes("CriOS") ? 6 : 7
        fullVersion = nAgt.substring(verOffset + _i);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("FxiOS")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 6);
    }
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    /* majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    } */

    return String.format('{0} ({1})', browserName, fullVersion)
}

export function getInfoOs() {
    if (isIpadOS())
        return "iOs (iPad)";

    if (navigator.userAgent.indexOf("Win") != -1)
        return "Windows";

    if (navigator.userAgent.indexOf("Mac") != -1)
        return "Macintosh";

    if (navigator.userAgent.indexOf("Linux") != -1)
        return "Linux";

    if (navigator.userAgent.indexOf("Android") != -1) {
        if (isTablet())
            return "Android (tablet)";

        return "Android";
    }

    if (navigator.userAgent.indexOf("like Mac") != -1)
        return "iOS";

    return "Unknown";
}



export function isIpadOS() {
    return (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0) || navigator.platform === 'iPad';
}

export function checkSameDomain(pzDomain: string, pzDomain1: string) {
    if (!pzDomain || !pzDomain1)
        return false;

    const _nLen = pzDomain.split('.').length;
    const _nLen1 = pzDomain1.split('.').length;

    if (Math.abs(_nLen - _nLen1) > 1)
        return false;

    if (_nLen == _nLen1) {
        if (String.compare(pzDomain, pzDomain1) == 0)
            return true;

        const _zMainDomain = pzDomain.substr(pzDomain.indexOf('.') + 1);
        return String.compare(pzDomain1.substr(pzDomain1.indexOf('.') + 1), _zMainDomain) == 0;
    }

    if (_nLen > _nLen1)
        return String.compare(pzDomain.substr(pzDomain.indexOf('.') + 1), pzDomain1) == 0;

    return String.compare(pzDomain1.substr(pzDomain1.indexOf('.') + 1), pzDomain) == 0;
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}
