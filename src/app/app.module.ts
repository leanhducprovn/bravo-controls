import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { App } from './app';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AngularSplitModule } from 'angular-split';

// Wijmo
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjNavModule } from '@grapecity/wijmo.angular2.nav';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';

// Components
import { BravoToolbar } from './components/bravo.toolbar/bravo.toolbar';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';
import { BravoDialogDataButton } from './components/bravo.dialog.data.button/bravo.dialog.data.button';
import { BravoTabGridLayout } from './components/bravo.tab.grid.layout/bravo.tab.grid.layout';
import { BravoPictureInputBox } from './components/bravo.picture.input.box/bravo.picture.input.box';
import { SafePipe } from './pipe/safe.pipe';
import { BravoImageCropper } from './components/bravo.image.cropper/bravo.image.cropper';
import { BravoMonacoEditorDemo } from './demo/bravo-monaco-editor-demo/bravo.monaco.editor.demo';

// Editor
import { BravoMonacoEditorModule } from './components/bravo.monaco.editor/bravo.monaco.editor.module';
@NgModule({
    declarations: [
        App,
        BravoToolbar,
        BravoPictureEditor,
        BravoDialogDataButton,
        BravoTabGridLayout,
        BravoPictureInputBox,
        SafePipe,
        BravoImageCropper,
        BravoMonacoEditorDemo
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        NgxSliderModule,
        WjInputModule,
        WjNavModule,
        WjGridModule,
        AngularSplitModule,
        BravoMonacoEditorModule
    ],
    providers: [],
    bootstrap: [App]
})
export class AppModule {}
