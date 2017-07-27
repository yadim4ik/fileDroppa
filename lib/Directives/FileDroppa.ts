import {Component, Input, EventEmitter, Output, ViewEncapsulation, OnInit} from '@angular/core';
import {FilesStore} from '../Services/FileStore.service';
import {FileUpload} from '../Services/FileUpload.service';

@Component({
    selector: 'app-file-droppa',
    providers: [FilesStore, FileUpload],
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../styles/FileDroppa.css'],
    template: `
        <div class="file-droppa-container">
            <app-file-drop-zone
              [multiple]="multiple"
              [openTriggerId]="openTriggerId"
            >
                <div [innerHTML]="dropZoneTemplate"></div>
            </app-file-drop-zone>
            <br/>
            <ng-content></ng-content>
            <fileList *ngIf="showFilesList"></fileList>
            <div class="file-droppa-btns" *ngIf="filesStore.iFiles.length && showButtons">
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
export class FileDroppaComponent implements OnInit {
    @Input() showFilesList = true;
    @Input() autoUpload = false;
    @Input() beforeRequest: Function = null;
    @Input() set url(tmpUrl: string) {
      this.fileUploadService.url = tmpUrl;
    }
    @Input() beforeFileUpload: Function = null;
    @Input() beforeAddFile: Function = null;
    @Input() dropZoneTemplate = `<div class="file_dropZone_internal">Drop Files Here</div>`;
    @Output() filesUpdated = new EventEmitter(true);
    @Output() fileUploaded = new EventEmitter(true);
    @Input() uploadButtonTemplate = `<div class="file-droppa-btn orange"><span>Upload All Files</span></div>`;
    @Input() removeButtonTemplate = `<div class="file-droppa-btn red"><span>Remove All Files</span>`;
    @Input() multiple = true;
    @Input() showButtons = true;
    @Input() openTriggerId: string;
    @Input() customStylesUrl: string;

    constructor(
      public filesStore: FilesStore,
      private fileUploadService: FileUpload
    ) {
        filesStore.filesUpdated.subscribe(() => {
            this.filesUpdated.emit(filesStore.files);
        });

        fileUploadService.fileUploadedEvent.subscribe(([success, response, iFile]) => {
            if (success) {
                this.filesStore.removeFiles(iFile);
            } else {
                iFile.loadingSuccessful = false;
                iFile.responseText = false;
            }
            this.fileUploaded.emit([success, response, iFile.file]);
        });
        filesStore.startAutoUploading = this.startAutoUploading.bind(this);
    }

    private startAutoUploading(iFile) {
        this.autoUpload && this.fileUploadService.uploadFile(iFile);
    }

    /**
     * We got to pass Input parameters to Service instances
     */
    ngOnInit() {
        this.filesStore.beforeAddFile = (typeof this.beforeAddFile === 'function') ? this.beforeAddFile : (file) => true;
        this.fileUploadService.beforeRequest = this.beforeRequest;
        if (typeof this.beforeFileUpload === 'function') {
            this.fileUploadService.beforeFileUpload = this.beforeFileUpload
        } else {
            this.fileUploadService.beforeFileUpload = (formData) => true
        }
    }

    removeAllFiles() {
        this.filesStore.clearStore();
    }

    uploadAllFiles() {
        this.fileUploadService.uploadFiles(this.filesStore.iFiles);
    }
}
