import {Component, Input, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';
import {File} from './File';
import {FilesStore} from "../Services/FileStore.service";
import {FileUpload} from "../Services/FileUpload.service";
import {iFile} from "../Services/FileWrapper.service";

@Component({
    selector: 'fileList, [fileList]',
    directives: [File],
    styles: [`
        .file-list {
            width: 430px;
            margin-bottom: 5px;
            display: flex;
            flex-flow: wrap;
            justify-content: flex-start;
         }
    `],
    template: `
        <div class="file-list">
            <fileItem *ngFor="let file of filesStore.iFiles"
                [file]="file.File"
                [percentage]="file.percentage"
                [loadingSuccessful]="file.loadingSuccessful"
                [responseMessage]="file.responseMessage"
                (removeFile)="removeFile(file)">
            </fileItem>
        </div>
    `
})

export class FileList {
    constructor(private filesStore:FilesStore){
    }

    removeFile(iFile:iFile) {
        this.filesStore.removeFiles(iFile);
    }
}