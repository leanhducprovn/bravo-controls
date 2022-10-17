import * as monaco from 'monaco-editor';

export type BravoMonaco = typeof import('monaco-editor');
export type BravoMonacoEditor = monaco.editor.IStandaloneCodeEditor;
export type BravoMonacoEditorOptions = monaco.editor.IStandaloneEditorConstructionOptions;

export interface BravoDiffEditorModel {
    code: string;
    language: string;
}
