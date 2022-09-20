import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Wijmo
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { BravoToolbarComponent } from './components/bravo.toolbar/bravo.toolbar';

@NgModule({
  declarations: [AppComponent, BravoToolbarComponent],
  imports: [BrowserModule, AppRoutingModule, WjInputModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
