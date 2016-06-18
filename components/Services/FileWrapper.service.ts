import {EventEmitter} from "@angular/core";
import {FileUpload} from "./FileUpload.service";

export interface iFile {
    File:File,
    removing:boolean,
    loading:boolean,
    percentage:number,
    id:string,
    loadingSuccessful:boolean,
    fileUploaded:any,
    responseMessage:string,
    uploader:FileUpload
}

export class FileWrapper {
    public File;
    public loading = false;
    public percentage = 0;
    public removing = false;
    public responseMessage = "Error happened during upload";
    public id = Math.random().toString(36).substr(2);
    public loadingSuccessful = true;
    public uploader = null;

    constructor(file){
        this.File = file;
    }
}