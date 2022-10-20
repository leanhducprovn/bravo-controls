import { BravoLangEnum } from './enums';

// @dynamic
export class BravoCulture {
    public static getLangCollection(): Array<BravoLangEnum> {
        return [
            BravoLangEnum.Vietnamese,
            BravoLangEnum.English,
            BravoLangEnum.Japanese,
            BravoLangEnum.Chinese,
            BravoLangEnum.Korean
            // BravoLangEnum.Custom
        ];
    }

    private static _ci = 'en-US';

    public static get ci(): string {
        return this._ci;
    }

    public static fixDateTimeString(pzStr: string, pLangCi: BravoLangEnum) {
        if (String.isNullOrEmpty(pzStr) || pLangCi == null || pLangCi !== BravoLangEnum.Vietnamese) return pzStr;

        return pzStr.replace('Tháng ', String.empty);
    }
}
