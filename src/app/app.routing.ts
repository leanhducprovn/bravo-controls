import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BravoDialogDataButton } from './components/bravo.dialog.data.button/bravo.dialog.data.button';
import { BravoPictureInputBox } from './components/bravo.picture.input.box/bravo.picture.input.box';
import { BravoTabGridLayout } from './components/bravo.tab.grid.layout/bravo.tab.grid.layout';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';
import { BravoToolbar } from './components/bravo.toolbar/bravo.toolbar';

import { BravoMonacoEditorDemo } from './demo/bravo.monaco.editor.demo/bravo.monaco.editor.demo';

const routes: Routes = [
    {
        path: 'bravo-monaco-editor-demo',
        component: BravoMonacoEditorDemo
    },
    {
        path: 'bravo-toolbar',
        component: BravoToolbar
    },
    {
        path: 'bravo-picture-editor',
        component: BravoPictureEditor
    },
    {
        path: 'bravo-dialog-data-button',
        component: BravoDialogDataButton
    },
    {
        path: 'bravo-tab-grid-layout',
        component: BravoTabGridLayout
    },
    {
        path: 'bravo-picture-input-box',
        component: BravoPictureInputBox
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
