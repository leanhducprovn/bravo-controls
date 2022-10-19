import { NgModule } from '@angular/core';
import { BravoMonacoEditorDirective } from './bravo.monaco.editor.directive';
import { BravoMonacoEditor } from './bravo.monaco.editor';
import { BravoMonacoDiffEditor } from './bravo.monaco.editor.diff';

@NgModule({
    imports: [],
    declarations: [BravoMonacoEditorDirective, BravoMonacoEditor, BravoMonacoDiffEditor],
    exports: [BravoMonacoEditorDirective, BravoMonacoEditor, BravoMonacoDiffEditor]
})
export class BravoMonacoEditorModule {}
