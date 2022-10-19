import * as monaco from 'monaco-editor';

export const BRAVO_MONACO_PATH = 'BRAVO_MONACO_PATH';

export type BravoMonaco = typeof import('monaco-editor');
export type BravoMonacoUri = monaco.Uri;
export type BravoMonacoTextModel = monaco.editor.ITextModel;
export type BravoMonacoStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
export type BravoMonacoStandaloneDiffEditor = monaco.editor.IStandaloneDiffEditor;
export type BravoMonacoEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
export type BravoMonacoDiffEditorConstructionOptions = monaco.editor.IStandaloneDiffEditorConstructionOptions;
