import * as monaco from 'monaco-editor';

// base
export const BRAVO_MONACO_PATH = 'BRAVO_MONACO_PATH';
export type BravoMonaco = typeof import('monaco-editor');

// class uri
export type BravoMonacoUri = monaco.Uri;

// namespaces editor
export type BravoMonacoTextModel = monaco.editor.ITextModel;
export type BravoMonacoStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
export type BravoMonacoStandaloneDiffEditor = monaco.editor.IStandaloneDiffEditor;
export type BravoMonacoEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
export type BravoMonacoDiffEditorConstructionOptions = monaco.editor.IStandaloneDiffEditorConstructionOptions;
export type BravoMonacoEditorMinimapOptions = monaco.editor.IEditorMinimapOptions;

// namespaces languages
export type BravoMonacoCompletionItem = monaco.languages.CompletionItem;
