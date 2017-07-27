import {Component} from '@angular/core';
import {FilesStore} from '../Services/FileStore.service';
import {iFile} from '../Services/FileWrapper.service';

@Component({
    selector: 'fileList, [fileList]',
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

export class FileListComponent {
    constructor(public filesStore: FilesStore) {
    }

    removeFile(iFile: iFile) {
        this.filesStore.removeFiles(iFile);
    }
}
