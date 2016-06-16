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
            width: 400px;
            margin-bottom: 25px;
            display: flex;
            flex-flow: wrap;
            justify-content: flex-start;
         }
    `],
    template: `
        <div class="file-list">
            <fileItem *ngFor="let iFile of iFiles"
                [file]="iFile.File"
                [percentage]="iFile.percentage"
                [uploaded]="iFile.loadingSuccessful"
                (removeFile)="removeFile(iFile)">
            </fileItem>
        </div>
    `
})

export class FileList {
    private iFiles = [];
    constructor(private filesStore:FilesStore){
        this.iFiles = filesStore.iFiles;
    }

    @Input() set uploadFiles(uploadFilesEmitter) {
        uploadFilesEmitter.subscribe(()=> {
            this.iFiles.forEach((iFile:iFile, i:number)=> {
                iFile.uploader.uploadFile().then(()=>{
                    this.notifyFilesUpdated.emit(this.filesStore.files);
                });
            })
        });
    }

    @Input() set removeAllFiles(removeAllFilesEmitter) {
        removeAllFilesEmitter.subscribe(()=> {
            this.onRemoveAllFiles();
        })
    }

    @Output() notifyFilesUpdated = new EventEmitter();

    onRemoveAllFiles() {
        this.filesStore.iFiles.forEach((iFile)=> {
            iFile.uploader.abortUploading();
        });
        this.filesStore.clearStore();
        this.notifyFilesUpdated.emit(this.filesStore.files);
    }

    removeFile(iFile:iFile) {
        iFile.uploader.abortUploading();
        this.filesStore.removeFiles(iFile);
        this.notifyFilesUpdated.emit(this.filesStore.files);
    }
}