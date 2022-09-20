import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing';
import { App } from './app';

// Wijmo
import { WjInputModule } from '@grapecity/wijmo.angular2.input';

// Components
import { BravoToolbar } from './components/bravo.toolbar/bravo.toolbar';
import { BravoPictureEditor } from './components/bravo.picture.editor/bravo.picture.editor';

@NgModule({
  declarations: [App, BravoToolbar, BravoPictureEditor],
  imports: [BrowserModule, AppRoutingModule, WjInputModule],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
