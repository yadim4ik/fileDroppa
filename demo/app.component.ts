///<reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import {Component, EventEmitter} from '@angular/core';
import FileDroppa from '../index'

@Component({
    selector: 'my-app',
    directives: [FileDroppa],
    template: `<fileDroppa
                    [url]="'https://salty-taiga-80701.herokuapp.com/upload'"
                    [autoUpload]="false"
                    [showFilesList]="true"
                    [beforeRequest]="beforeRequest"
                    [beforeFileUpload]="beforeFileUpload"
                    [beforeAddFile]="beforeAddFile"
                    (filesUpdated)="filesUpdated($event)"
                    (fileUploaded)="fileUploaded($event)"
               >
               <!--<h1>-->
                    <!--You can pass anything you want here-->
                    <!--You can set you own file list here-->
               <!--</h1>-->
               </fileDroppa>`
})
export class AppComponent {
    /**
     * You can override default dropZone area template with [dropZoneTemplate] parameter passed to fileDroppa component
     */
    //public dropZoneTemplate = `
    //    <div class="awesome_override_xxx">Here I'm overriding library template</div>
    //`;
    /**
     * EVENTS
     */
    fileUploaded(success, response, file){
        success && console.log("uploaded - awesome", response, file);
        success || console.log("not uploaded - very bad", response, file);
    }

    filesUpdated(files) {
        console.log("Store state updated! Current state: ", files)
    }

    /**
     * CALLBACKS
     */

    /**
     * This method is called before Request happened
     * You can modify xhr confoguration in it
     * requestHeaders for example
     *
     * @param xhr
     */
    beforeRequest(xhr){
        xhr.setRequestHeader("Hello","World");
    }

    /**
     * This method allows you to make validation before file is sent
     * You can update fileName for example
     * Or you can return null and file won't be send
     *
     * @param formData
     * @returns formData or null
     */
    beforeFileUpload(formData){
        return null;
    }

    /**
     * This method is called once your drop or select files
     * You can validate and decline or accept file
     *
     * @param file
     * @returns Boolean
     */
    beforeAddFile(file){
        return true;
    }
}
