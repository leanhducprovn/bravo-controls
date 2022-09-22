export interface IBravoExpressionEvaluator {
    isTrue(pzExpression: string, pDataItem?: any);
    evaluate(pzExpression: string, pDataItem?: any);
    evaluateText(pzText: string, pDataItem?: any, pCulture?: any);
    evaluateRtfText(pzText: string, pDataItem?: any, pCulture?: any);
}