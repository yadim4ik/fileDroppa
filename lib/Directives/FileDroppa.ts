import {Component, Input, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {FileDropZone} from './FileDropZone';
import {FileList} from './FileList';
import {FilesStore} from "../Services/FileStore.service";
import {File} from "./File";
import {FileUpload} from "../Services/FileUpload.service";

@Component({
    selector: 'fileDroppa',
    providers:[FilesStore, FileUpload],
    encapsulation: ViewEncapsulation.None,
    styles:[`
        .file-droppa-container {
            width: 400px;
        }
        .file-droppa-btns {
         display: flex;
          align-items: center;
          justify-content: center;

        }
        .file-droppa-btn {
              margin: 15px;
              padding: 0;

              overflow: hidden;

              border-width: 0;
              outline: none;
              border-radius: 2px;
              box-shadow: 0 1px 4px rgba(0, 0, 0, .6);

              background-color: #2ecc71;
              color: #ecf0f1;

              transition: background-color .3s;
              width: 140px;
              text-align: center;
              font-size: 12px;

        }

        .file-droppa-btn:hover{
          background-color: #27ae60;
        }

        .file-droppa-btn span {
          display: block;
          padding: 12px 24px;
        }

        .file-droppa-btn.orange {
          background-color: #e67e22;
        }

        .file-droppa-btn.orange:hover {
          background-color: #d35400;
        }

        .file-droppa-btn.red {
          background-color: #e74c3c;
        }

        .file-droppa-btn.red:hover{
          background-color: #c0392b;
        }
        `
    ],
    template: `
        <div class="file-droppa-container">
            <fileDropZone>
                <div [innerHTML]="dropZoneTemplate"></div>
            </fileDropZone>
            <br/>
            <ng-content></ng-content>
            <fileList *ngIf="showFilesList"></fileList>
            <div class="file-droppa-btns" *ngIf="filesStore.iFiles.length">
              <div #uploadButtonArea (click)="uploadAllFiles($event)">
                <ng-content select="[upload-button]"></ng-content>
              </div>
              <div *ngIf="uploadButtonArea.children.length === 0" (click)="uploadAllFiles($event)"
                   [innerHTML]="uploadButtonTemplate"></div>
              <div #removeButtonArea (click)="removeAllFiles($event)">
                <ng-content select="[remove-button]"></ng-content>
              </div>
              <div *ngIf="removeButtonArea.children.length === 0" (click)="removeAllFiles($event)"
                   [innerHTML]="removeButtonTemplate"></div>
            </div>
        </div>
    `
})
export class FileDroppa {
    @Input() showFilesList:boolean = true;
    @Input() autoUpload:boolean = false;
    @Input() beforeRequest:Function = null;
    @Input() set url(tmpUrl: string) {
      this.fileUploadService.url = tmpUrl;
    }
    @Input() beforeFileUpload:Function = null;
    @Input() beforeAddFile:Function = null;
    @Input() dropZoneTemplate:string = `
      <div class="file_dropZone_internal">
          Drop Files Here
      </div>
    `;
    @Output() filesUpdated = new EventEmitter(true);
    @Output() fileUploaded = new EventEmitter(true);
    @Input() uploadButtonTemplate:string = `
      <div class="file-droppa-btn orange">
        <span>Upload All Files</span>
       </div>
    `;
    @Input() removeButtonTemplate:string = `
      <div class="file-droppa-btn red">
        <span>Remove All Files</span>
       </div>
    `;

    constructor(public filesStore:FilesStore, private fileUploadService: FileUpload){
        filesStore.filesUpdated.subscribe(()=>{
            this.filesUpdated.emit(filesStore.files);
        });
        fileUploadService.fileUploadedEvent.subscribe(([success, response, iFile])=>{
            if(success){
                this.filesStore.removeFiles(iFile);
            } else {
                iFile.loadingSuccessful = false;
                iFile.responseText = false;
            }
            this.fileUploaded.emit([success, response, iFile.file]);
        });
        filesStore.startAutoUploading = this.startAutoUploading.bind(this);
    }

    private startAutoUploading(iFile){
        this.autoUpload && this.fileUploadService.uploadFile(iFile);
    }

    /**
     * We got to pass Input parameters to Service instances
     */
    ngOnInit(){
        this.filesStore.beforeAddFile = (typeof this.beforeAddFile==="function") ? this.beforeAddFile : (file) => true;
        this.fileUploadService.beforeRequest = this.beforeRequest;
        this.fileUploadService.beforeFileUpload = (typeof this.beforeFileUpload==="function") ? this.beforeFileUpload : (formData) => true;
    }

    removeAllFiles() {
        this.filesStore.clearStore();
    }

    uploadAllFiles() {
        this.fileUploadService.uploadFiles(this.filesStore.iFiles);
    }
}
