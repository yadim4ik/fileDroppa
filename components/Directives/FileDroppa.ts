import {Component, Input, EventEmitter, Output, Injector} from '@angular/core';
import {FileDropZone} from './FileDropZone';
import {FileList} from './FileList';
import {FilesStore} from "../Services/FileStore.service";
import {File} from "./File";

@Component({
    selector: 'fileDroppa',
    directives: [FileDropZone, FileList],
    providers:[FilesStore],

    template: `
            <fileDropZone></fileDropZone>
            <br/>
            <fileList></fileList>
            <div *ngIf="showButtons">
                <button (click)="upload($event)">Upload All Files</button>
                <button (click)="remove($event)">Remove All Files</button>
            </div>
    `
})
export default class FileDroppa {
    constructor(private filesStore:FilesStore){
        filesStore.filesUpdated.subscribe(()=>{
            console.log(`files store udpated ${filesStore.iFiles}`)
        });
        filesStore.fileUploaded.subscribe(([success, response, file])=>{
            console.log(`file uploaded ${success} ${file}`)
        });
    }
}

