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
import { BravoDocxtemplater } from './components/bravo.docxtemplater/bravo.docxtemplater';
import { BravoWebviewer } from './components/bravo.webviewer/bravo.webviewer';
import { BravoDocxPreview } from './components/bravo.docx.preview/bravo.docx.preview';

// Demo
import { BravoMonacoEditorDemo } from './demo/bravo.monaco.editor.demo/bravo.monaco.editor.demo';
import { BravoPictureEditorDemo } from './demo/bravo.picture.editor.demo/bravo.picture.editor.demo';
import { BravoTabGridLayoutDemo } from './demo/bravo.tab.grid.layout.demo/bravo.tab.grid.layout.demo';

// Editor
import { BravoMonacoEditorModule } from './components/bravo.monaco.editor/bravo.monaco.editor.module';
import { BravoMonacoEditorBaseDemo } from './demo/bravo.monaco.editor.base.demo/bravo.monaco.editor.base.demo';

import { BravoTools } from './layouts/bravo.tools/bravo.tools';
import { BravoFullScreen } from './layouts/bravo.full.screen/bravo.full.screen';
import { BravoDemo } from './layouts/bravo.demo/bravo.demo';
import { BravoHome } from './layouts/bravo.home/bravo.home';
import { BravoCalendar } from './components/bravo.calendar/bravo.calendar';
import { BravoCalendarDemo } from './demo/bravo.calendar.demo/bravo.calendar.demo';
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
        BravoMonacoEditorDemo,
        BravoPictureEditorDemo,
        BravoMonacoEditorBaseDemo,
        BravoTabGridLayoutDemo,
        BravoDocxtemplater,
        BravoWebviewer,
        BravoTools,
        BravoFullScreen,
        BravoDemo,
        BravoHome,
        BravoDocxPreview,
        BravoCalendar,
        BravoCalendarDemo
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
