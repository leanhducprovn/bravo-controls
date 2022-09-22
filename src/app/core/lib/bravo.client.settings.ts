import { BravoLangEnum, RunningMode } from "./enums";
import { BravoCulture } from "./bravo.culture";
import { isUndefined } from "@grapecity/wijmo";
import { BravoDataTypeConverter } from "./bravo.datatype.converter";
import { isMobile } from "./bravo.core.function";

export const CurrentLanguageKey = "CurrentLanguage";
export const FontSizeKey = 'FontSize';

const RunningOnlyReportProp = 'runningOnlyReport';
const RunngingModeProp = 'runningMode';

// @dynamic
export class BravoClientSettings {
    private static _currentLang: BravoLangEnum;

    public static get currentLang(): BravoLangEnum {
        if (this._currentLang == null) {
            const _out = { resultValue: null };
            if (BravoDataTypeConverter.isEnumType(BravoLangEnum, localStorage.getItem(CurrentLanguageKey), _out))
                this._currentLang = _out.resultValue;
        }

        return this._currentLang;
    }

    public static set currentLang(value: BravoLangEnum) {
        if (this._currentLang == value) return;
        this._currentLang = value;

        localStorage.setItem(CurrentLanguageKey, value.toString());
        this._nCurrentLangId = BravoCulture.getLangCollection().findIndex(x => x == value);
    }

    public static get fontSize(): number {
        if (isMobile())
            return 11;

        const _fontSize = localStorage.getItem(FontSizeKey);
        return Number.asNumber(_fontSize) || 9.75;
    }

    public static set fontSize(value: number) {
        let _fs = Number.asNumber(localStorage.getItem(FontSizeKey));
        if (_fs == value) return;

        localStorage.setItem(FontSizeKey, value.toString());
    }

    public static get zCurrentLang(): string {
        return BravoLangEnum[this.currentLang];
    }

    public static zIndexQuickSearch = '1500';

    public static zIndexThumbnailReport = '1500';

    public static nAutoHidePopup = 5000;

    public static nMRUMaxItems = 10;

    public static nAutoTooltipDelayTime = 500;

    public static nActiveItemDelayTime = 300;

    public static nAutoSearchDelayTime = 300;

    public static nFocusDelayTime = 100;

    private static _nCurrentLangId;

    public static get nCurrentLangId(): number {
        if (this._nCurrentLangId == null)
            this._nCurrentLangId = BravoCulture.getLangCollection().findIndex(x => x == this.currentLang);

        return this._nCurrentLangId;
    }

    private static _bRunningOnlyReport: boolean = false;

    public static get bRunningOnlyReport(): boolean {
        return this._bRunningOnlyReport;
    }

    private static _runningMode = RunningMode.SameWinform;

    public static get runningMode(): RunningMode {
        return this._runningMode;
    }

    public static setupAppConfig(config) {
        if (config == null) return;

        let _mode = config[RunngingModeProp];
        if (_mode != null)
            this._runningMode = _mode;

        let _bRunningOnlyReport = config[RunningOnlyReportProp];
        if (!isUndefined(_bRunningOnlyReport))
            this._bRunningOnlyReport = _bRunningOnlyReport;
    }
}