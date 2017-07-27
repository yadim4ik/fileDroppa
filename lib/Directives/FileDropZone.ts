import {Component, ElementRef, Input, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {FileParser} from '../Services/FileParser.service';
import {FilesStore} from '../Services/FileStore.service';

@Component({
    selector: 'app-file-drop-zone, [fileDropZone]',
    providers: [FileParser],
    styles: [`
        .file_dropZone_internal {
            border: 3px dashed #DDD;
            border-radius:10px;
            padding:10px;
            width:400px;
            height:200px;
            color:#CCC;
            text-align:center;
            display:table-cell;
            vertical-align:middle;
            cursor:pointer;
        }
    `],
    template: `
        <ng-content></ng-content>
    `,
    host: {
        '(drop)': 'drop($event)',
        '(dragenter)': 'dragenter($event)',
        '(dragover)': 'dragover($event)',
        '(dragleave)': 'dragleave($event)',
        '(click)': 'onClick($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class FileDropZoneComponent {
    private hiddenFileInput = null;
    public promise = null;
    public openTrigger = null;

    constructor(
      private filesStore: FilesStore,
      private el: ElementRef,
      private fileParser: FileParser
    ) {
        this.createHiddenInput();
    }

    @Input()
    set multiple(value: boolean) {
      const attributeName = 'multiple';
      if (value) {
        this.hiddenFileInput.setAttribute(attributeName, attributeName);
      } else {
        this.hiddenFileInput.removeAttribute(attributeName)
      }
    }

    @Input()
    set openTriggerId(id: string) {
      // console.log(id);
      if (id) {
        this.openTrigger = document.getElementById(id);
        this.openTrigger.addEventListener('click', () => {this.hiddenFileInput.click()})
      }
    }

    /*
     * Host Event Listeners
     * */

    onClick(e) {
        this.hiddenFileInput && this.hiddenFileInput.click();
    }

    drop(e) {
        e.preventDefault();
        if (!e.dataTransfer || !e.dataTransfer.files.length) {
            return;
        }
        this.promise = this.fileParser.processInputFromDrop(e)
            .then((files) => {
                this.updateFilesStore([...files]);
            });
        this.updateStyles();
    }

    dragenter(e) {
        e.preventDefault()
    }

    dragover(e) {
        e.preventDefault();
        this.updateStyles(true);
    }

    dragleave(e) {
        e.preventDefault();
        this.updateStyles();
    }

    /*
     * Public methods
     * */

    OnDestroy() {
        this.hiddenFileInput && document.body.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
    }

    updateStyles(dragOver: boolean = false) {
        // this.el.nativeElement.classList[(dragOver) ? 'add' : 'remove'](this._overCls);
    }

    updateFilesStore(files: Array<File>): void {
        this.filesStore.addFiles(files);
    }

    createHiddenInput() {
        this.hiddenFileInput && document.body.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = document.createElement('input');
        this.hiddenFileInput.setAttribute('type', 'file');
        this.hiddenFileInput.setAttribute('multiple', 'multiple');
        this.hiddenFileInput.style.visibility = 'hidden';
        this.hiddenFileInput.style.position = 'absolute';
        this.hiddenFileInput.style.top = 0;
        this.hiddenFileInput.style.left = 0;
        this.hiddenFileInput.style.height = 0;
        this.hiddenFileInput.style.width = 0;
        this.hiddenFileInput.className = '_hiddenInputClassName';
        document.body.appendChild(this.hiddenFileInput);
        this.hiddenFileInput.addEventListener('change', (e) => {
            const files = [];
            for (let i = 0, l = e.target.files.length; i < l; i++) {
                files.push(e.target.files[i]);
            }
            console.log(this.hiddenFileInput.value);
            this.hiddenFileInput.value = '';
            this.updateFilesStore(files);
        });
    }

}
