import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.routing';
import { App } from './app';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

// Wijmo
import { WjInputModule } from '@grapecity/wijmo.angular2.input';

// Components
import { BravoToolbar } from './components/bravo.toolbar/bravo.toolbar';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';
import { BravoDialogDataButton } from './components/bravo.dialog.data.button/bravo.dialog.data.button';
import { BravoTabGridLayout } from './components/bravo.tab.grid.layout/bravo.tab.grid.layout';

@NgModule({
  declarations: [App, BravoToolbar, BravoPictureEditor, BravoDialogDataButton, BravoTabGridLayout],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, NgxSliderModule, WjInputModule],
  providers: [],
  bootstrap: [App],
})
export class AppModule { }
