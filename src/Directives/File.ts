import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {EmitterService} from '../Services/Emitter.service';
import {FileUpload} from '../Services/FileUpload.service';

@Component({
    selector: 'fileItem',
    providers: [FileUpload],
    styles: [`
        div {
            padding-top: 15px;
        }
        div span:first-child {
            padding-left:0;
        }
        span {
            padding-left: 20px;
        }
        span.item-remove {
            cursor: pointer;
        }
    `],
    template: `
        <div *ngIf="file">
            <span>{{index}} {{file.name}}</span>
            <span>{{file.size}} bytes</span>
            <progress [value]="progress" max="100"></progress>
            <span> Status: {{uploadStatus}}</span>
            <span (click)=removeFileListener(index) class='item-remove'>remove</span>
        </div> 
    `,
    inputs: ['file', 'index']
})

export class File {
    public file;
    public index;
    progress:number = 0;
    uploadStatus:string = ''

    constructor(private fileUpload:FileUpload) {
        EmitterService.get('doUpload').subscribe(data => {
            fileUpload.uploadFile(this.file);
            this.uploadStatus = 'pending'
        });

        fileUpload.onProgress.subscribe((progress) => {
            this.progress = progress;
            //TODO: find out why value in template not updated
            console.log(this.progress)
        });

        fileUpload.onSuccess.subscribe(() => {
            this.uploadStatus = 'uploaded'
        });
    }

    @Output() removeFile = new EventEmitter();

    removeFileListener(file) {
        this.removeFile && this.removeFile.emit(file);
    }

}