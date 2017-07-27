import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FileDroppaComponent} from './Directives/FileDroppa';
import {File} from './Directives/File';
import {FileDropZoneComponent} from './Directives/FileDropZone';
import {FileListComponent} from './Directives/FileList';
import {GetSizePipe} from './Pipes/GetSize.pipe';

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      GetSizePipe,
      FileDroppaComponent,
      File,
      FileDropZoneComponent,
      FileListComponent
    ],
    exports: [
      FileDroppaComponent,
      File,
      FileDropZoneComponent,
      FileListComponent
    ],
})
export class FileDroppa {
}
