import * as wjc from '@grapecity/wijmo';

export class StringBuilder {
    private _strings: wjc.ObservableArray;
    public get strings(): wjc.ObservableArray {
        return this._strings;
    }
    public set strings(value: wjc.ObservableArray) {
        this._strings = value;
    }

    public get length(): number {
        return this.internalStrings.length;
    }

    constructor(pCollection?: Array<string>) {
        if (pCollection instanceof Array)
            this._strings = new wjc.ObservableArray(pCollection);
        else this._strings = new wjc.ObservableArray();
    }

    private get internalStrings(): string {
        return this._strings ? this.strings.join('') : String.empty;
    }

    get(pos: number) {
        if (pos < 0 || pos >= this.length) return null;

        return this.internalStrings[pos];
    }

    /* set(pos: number, value: string) {
        if (pos < 0 || pos >= this.length)
            return;

        if (this._strings == null || this._strings.length < 1)
            return;

        if (this._strings.length == 1) {
            this._strings[0][pos] = value;
            return;
        }

        let _nLen = this._strings[0].length;
        for (let _i = 1; _i < this._strings.length; _i++) {
            let _str: string = this._strings[_i];
            if (!_str) continue;

            if (_nLen + _str.length - 1 < pos) {
                _nLen += _str.length;
                continue;
            }

            if ((pos - _nLen) < _str.length) {
                let _nPos = pos - _nLen;
                this._strings[_i] = _str.substring(0, _nPos) + value + _str.substring(_nPos - 1, _str.length);
                return;
            }
        }
    } */

    clone() {
        let _strings = this._strings.clone();
        return new StringBuilder(_strings);
    }

    append(value: string | StringBuilder) {
        if (value instanceof StringBuilder) {
            this.strings.push(...value.strings);
            return;
        }

        if (value) this.strings.push(value);
    }

    appendLine(value?) {
        if (value) {
            this.strings.push(String.format('{0}\n', value));
        } else {
            this.strings.push('\n');
        }

        return this;
    }

    appendFormat(format: string, ...args: Array<any>) {
        this.strings.push(String.format(format, ...args));
    }

    insert(index: number, value: string) {
        this.strings.insert(index, value);
    }

    clear() {
        this.strings.length = 0;
    }

    toString() {
        return this.internalStrings;
    }
}
