import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import {
    BRAVO_MONACO_EDITOR_CONFIG,
    BravoMonacoEditorConfig
} from './bravo.monaco.editor.config';
import { BravoMonacoDiffEditor } from './bravo.monaco.editor.diff';
import { BravoMonacoEditor } from './bravo.monaco.editor';

@NgModule({
    imports: [CommonModule],
    declarations: [BravoMonacoEditor, BravoMonacoDiffEditor],
    exports: [BravoMonacoEditor, BravoMonacoDiffEditor]
})
export class BravoMonacoEditorModule {
    public static forRoot(
        config: BravoMonacoEditorConfig = {}
    ): ModuleWithProviders<BravoMonacoEditorModule> {
        return {
            ngModule: BravoMonacoEditorModule,
            providers: [
                { provide: BRAVO_MONACO_EDITOR_CONFIG, useValue: config }
            ]
        };
    }
}
