///<reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import {Component, EventEmitter} from '@angular/core';
import {FileDropZone} from '../index'

@Component({
    selector: 'my-app',
    directives: [FileDropZone],
    template: `<fileDropZone 
                    [config]="fileDroppaConfig"
                    (filesUpdated)="filesUpdated($event)"
                    (fileUploaded)="fileUploaded($event)"
                    >
               </fileDropZone>`
})
export class AppComponent {
    fileDroppaConfig;

    constructor() {
        this.fileDroppaConfig = {
            overCls: "customDrop",
            removeWhenUploaded: false,
            autoUpload: false,
            uploadUrl: "https://salty-taiga-80701.herokuapp.com/upload",
            beforeUpload: this.beforeUpload,
            validateFile: this.validateFile
            //requestHeaders:{
            //    'X-Content':'xxx'
            //}
        };
    }

    validateFile(file){
        //You can provide any file validation you want here
        return true;
    }

    beforeUpload(file){
        return new Promise((res, rej)=>{
           setTimeout(()=>{
               res(["nameYouLike", file]);
           },1000)
        });
        //return ["nameYouLike", file];
    }

    fileUploaded([success, response, file]){
        success && console.log("uploaded - awesome", response, file);
        success || console.log("not uploaded - very bad", response, file);
    }

    filesUpdated(files) {
        console.log("added", files)
    }

}
