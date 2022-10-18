export class BravoDebug {
    private constructor() {}

    private static _debugExpressionCollection: Array<string> = null;

    public static isDebugExpression(pzExpression: string) {
        if (!this._debugExpressionCollection) return false;

        for (const _z of this._debugExpressionCollection) {
            if (pzExpression.includes(_z) || String.compare(pzExpression, _z) == 0) return true;
        }

        return false;
    }

    public static startDebugExpression(pzExpression: string) {
        if (!this._debugExpressionCollection) this._debugExpressionCollection = new Array<string>();

        if (!this._debugExpressionCollection.includes(pzExpression))
            this._debugExpressionCollection.push(pzExpression);
    }

    public static stopDebugExpression(pzExpression: string) {
        if (this._debugExpressionCollection) {
            let _i = this._debugExpressionCollection.indexOf(pzExpression);
            this._debugExpressionCollection.splice(_i, 1);
        }
    }
}
