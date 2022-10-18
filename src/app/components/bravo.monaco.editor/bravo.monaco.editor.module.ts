import { NgModule } from '@angular/core';
import { MonacoEditorLoaderDirective } from './bravo.monaco.editor.directive';
import { MonacoEditorComponent } from './bravo.monaco.editor';
import { MonacoDiffEditorComponent } from './bravo.monaco.editor.diff';

@NgModule({
    imports: [],
    declarations: [MonacoEditorLoaderDirective, MonacoEditorComponent, MonacoDiffEditorComponent],
    exports: [MonacoEditorLoaderDirective, MonacoEditorComponent, MonacoDiffEditorComponent]
})
export class MonacoEditorModule {}
