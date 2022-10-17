export type Monaco = typeof import('monaco-editor');
export interface BravoDiffEditorModel {
    code: string;
    language: string;
}
export interface BravoEditorModel {
    value: string;
    language?: string;
    uri?: any;
}
