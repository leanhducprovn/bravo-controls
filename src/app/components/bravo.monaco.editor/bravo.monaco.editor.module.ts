import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import {
    BRAVO_MONACO_EDITOR_CONFIG,
    BravoMonacoEditorConfig
} from './bravo.monaco.editor.config';
import { DiffEditorComponent } from './bravo.monaco.editor.diff';
import { BravoMonacoEditor } from './bravo.monaco.editor';

@NgModule({
    imports: [CommonModule],
    declarations: [BravoMonacoEditor, DiffEditorComponent],
    exports: [BravoMonacoEditor, DiffEditorComponent]
})
export class MonacoEditorModule {
    public static forRoot(
        config: BravoMonacoEditorConfig = {}
    ): ModuleWithProviders<MonacoEditorModule> {
        return {
            ngModule: MonacoEditorModule,
            providers: [
                { provide: BRAVO_MONACO_EDITOR_CONFIG, useValue: config }
            ]
        };
    }
}
