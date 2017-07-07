import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FileDroppa } from '../../lib/index';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FileDroppa,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
