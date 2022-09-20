import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Wijmo
import { WjInputModule } from '@grapecity/wijmo.angular2.input';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, WjInputModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
