import { tryCast, ObservableArray, isString } from '@grapecity/wijmo';
import { BravoCryptography } from '../bravo.cryptography';
import { BravoLangEnum } from '../enums';
import { ExtensionsMethod } from '../extensions.method';

const ExpressionAttribute: string = 'Expression';
const AbbvExpressionAttribute = 'Expr';
const EncryptAttribute = 'Encrypt';

export class BravoLayoutItem {
    public static readonly LayoutNameAttribute = 'LayoutName';

    public name: string;
    public value: any;
    public description: string;
    public attributes: any;
    public type: string;

    private parent: BravoLayoutItem;

    public set parentItem(val: BravoLayoutItem) {
        this.parent = val;
    }

    public get parentItem(): BravoLayoutItem {
        return this.parent;
    }

    public get bHasAttributes(): boolean {
        return this.attributes && Object.keys(this.attributes).length > 0;
    }

    constructor(name?: string, value?: any, description?: string, attributes?: any) {
        this.name = name;
        this.value = value;
        this.description = description;
        this.attributes = attributes || {};
    }

    public get bIsData(): boolean {
        return tryCast(this.value, 'IBravoLayoutData') != null ? true : false;
    }

    public isEncrypt() {
        return (
            this.bHasAttributes &&
            this.attributes[EncryptAttribute] &&
            Boolean.asBoolean(this.attributes[EncryptAttribute])
        );
    }

    public isExpression() {
        return (
            this.bHasAttributes &&
            ((this.attributes['expr'] && Boolean.asBoolean(this.attributes['expr'])) ||
                (this.attributes[ExpressionAttribute] && Boolean.asBoolean(this.attributes[ExpressionAttribute])) ||
                (this.attributes[AbbvExpressionAttribute] &&
                    Boolean.asBoolean(this.attributes[AbbvExpressionAttribute])))
        );
    }

    public data() {
        return tryCast(this.value, 'IBravoLayoutData');
    }

    public bool() {
        return this.value == 'true' || this.value == 'True';
    }

    public number() {
        return Number.asNumber(this.value);
    }

    public deserialize() {
        return this.object();
    }

    public object() {
        const _zStr = String.format('{0}', this.value);
        if (_zStr.replace(' ', '').length % 4 != 0) return null;

        try {
            return ExtensionsMethod.deserializebase64(_zStr);
        } catch (_ex) {
            console.error(_ex);
        }
    }

    public str(pzLangKey?): string {
        if (this.value != null) {
            let _l = this.value;
            if (_l && tryCast(this.value, 'IBravoLayoutData') != null) {
                if (!isString(pzLangKey)) pzLangKey = BravoLangEnum[pzLangKey];

                return _l.contains(pzLangKey) && _l.get(pzLangKey) ? _l.get(pzLangKey).value : String.empty;
            }
        }

        const _zVal = String.format('{0}', this.value);
        if (this.isEncrypt()) {
            const _zPlainText = BravoCryptography.decryptString(_zVal);
            if (String.compare(_zPlainText, _zVal) != 0) return _zPlainText;
        }

        return _zVal;
    }

    public getHierarchy(outArgs?: { pzLayoutNameAttribute: string }, pbExcludeRoot: boolean = false) {
        if (outArgs == null) outArgs = { pzLayoutNameAttribute: null };
        else outArgs.pzLayoutNameAttribute = null;

        const _keys = new ObservableArray();
        let _it: BravoLayoutItem = this;
        while (_it) {
            if (_it.attributes && _it.attributes[BravoLayoutItem.LayoutNameAttribute])
                outArgs.pzLayoutNameAttribute = _it.attributes[BravoLayoutItem.LayoutNameAttribute];

            if (pbExcludeRoot && _it.parentItem == null && String.compare(_it.name, 'root') == 0) break;

            _keys.splice(0, 0, _it.name);
            _it = _it.parentItem;
        }

        return _keys;
    }
}
