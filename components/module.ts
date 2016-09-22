import '../demo/polyfills';
import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Component} from "@angular/core";
import { FileDroppa as FileDroppaComponent } from "./Directives/FileDroppa";
import {File} from "./Directives/File";
import {FileDropZone} from "./Directives/FileDropZone";
import {FileList} from "./Directives/FileList";
import {GetSizePipe} from "./Pipes/GetSize.pipe";

@NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      GetSizePipe,
      FileDroppaComponent,
      File,
      FileDropZone,
      FileList
    ],
    exports: [
      FileDroppaComponent,
      File,
      FileDropZone,
      FileList
    ],
})
export class FileDroppa {

}
