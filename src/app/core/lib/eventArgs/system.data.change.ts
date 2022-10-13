export class SystemDataChange {
    public readonly systemType: BravoSystemTypeEnum = BravoSystemTypeEnum.None;

    public readonly data: any;

    public readonly windowGuid: string;

    constructor(type: BravoSystemTypeEnum, data?: any, guid?: string) {
        this.systemType = type;
        this.data = data;
        this.windowGuid = guid;
    }

    public implementsInterface(interfaceName: string) {
        return interfaceName == 'SystemDataChange';
    }
}

export enum BravoSystemTypeEnum {
    None,
    Branch,
    Fiscal,
    Language,
    FontSize,
    RefreshToken
}
