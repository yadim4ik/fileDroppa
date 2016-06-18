import {
    Component, Input, Output, EventEmitter
} from '@angular/core';
import {NgStyle} from '@angular/common';
import {GetSizePipe} from '../Pipes/GetSize.pipe';

@Component({
    selector: 'fileItem',
    pipes: [GetSizePipe],
    styles: [`
        .file-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 75px;
            margin: 20px 10px 0 0;
            transition: opacity 0.5s, margin 0.5s linear;
            flex-direction: column;
            position:relative;
        }

        .file-container.uploaded {
            opacity: 0;
            margin: 0;
            height: 0;
            overflow: hidden;
        }

        .flex-block {
            width: 90%;
            text-align: center;
            font-size: 0.8em;
            margin: 2px 0;
        }

        .file-remove {
            cursor: pointer;
            position: absolute;
            left: 87%;
            top: 8px;
        }
        .file-upload-error {
            position: absolute;
            top: 8px;
            left:-8px;
        }
        .file-name {
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .file-preview {
            background: #ccc;
            border-radius: 2px;
            width: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-size: cover;
            color: #fff;
        }

         .file-preview-ext {
            text-transform: uppercase;
        }

        .file-progress {
            width: 80%;
            display: block;
        }


        button {
            margin: 0;
        }

span {
    position:relative;
    z-index:1;
    overflow:hidden;
    list-style:none;
    padding:0;
    margin:0 0 0.25em;
}

span a:link {
    display:block;
    border:0;
    padding-left:28px;
    color:#c55500;
}

span a:hover,
span a:focus {
    color:#730800;
    background:transparent;
}

span:before,
span:after,
span a:before,
span a:after {
    content:"";
    position:absolute;
    top:50%;
    left:0;
}

span a:before,
span a:after {
    margin:-8px 0 0;
    background:#c55500;
}

span a:hover:before,
span a:focus:before {
    background:#730800;
}


.remove a:before {
    width:16px;
    height:16px;
    /* css3 */
    -webkit-border-radius:16px;
    -moz-border-radius:16px;
    border-radius:16px;
}

.remove a:after {
    left:3px;
    width:10px;
    height:2px;
    margin-top:-1px;
    background:#fff;
}
.warning:before {
    content:"!";
    z-index:2;
    left:8px;
    margin-top:-8px;
    font-size:14px;
    font-weight:bold;
    color:#000;
}

.warning:after {
    z-index:1;
    border-width:0 11px 18px;
    border-style:solid;
    border-color:#F8D201 transparent;
    margin-top:-10px;
    background:transparent;
}

.file-upload-error .tooltiptext {
    visibility: hidden;
    white-space:nowrap;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}

.file-upload-error:hover .tooltiptext {
    visibility: visible;
}

    `],
    template: `
        <div *ngIf="file" class="file-container">
            <div class="flex-block file-preview" [ngStyle]="{'background-image': 'url(' + previewSrc + ')', 'height': previewHeight + 'px'}">
                <div *ngIf="ext" class="flex-block file-preview-ext ">{{ext}}</div>
                <div *ngIf="!previewSrc" class="flex-block file-name">{{fileName}}</div>
                <progress [value]="percentage" max="100" class="file-progress"></progress>
            </div>
            <div class="file-remove">
                <span class="remove"><a href="#" (click)="removeFileListener($event)"></a></span>
            </div>
            <div *ngIf="!loadingSuccessful" class="file-upload-error">
                <span class="warning"></span>
                <span *ngIf="responseMessage" class="tooltiptext">{{responseMessage}}</span>
            </div>
            <div class="flex-block">{{file.size | getSize }}</div>
        </div>
    `
})

export class File {
    public ext:string = '';
    public previewSrc:string = '';
    public fileName:string = '';
    //TODO: workaround - depends on strict values;
    public previewHeight:number = 75;


    //ngHooks
    ngAfterContentInit() {
        this.file && this.getFileType();
    }

    @Input() file;
    @Input() index;
    @Input() percentage;
    @Input() loadingSuccessful;
    @Input() responseMessage;

    @Output() removeFile = new EventEmitter(true);


    removeFileListener(e) {
        e.preventDefault();
        this.removeFile && this.removeFile.emit(true);
    }

    getFileType() {
        let imageType = /^image\//,
            reader;

        if (!imageType.test(this.file.type)) {
            let ext = this.file.name.split('.').pop();

            this.fileName = this.file.name;
            this.ext = ext.length > 3
                ? 'file'
                : `.${ext}`;
            return;
        }

        reader = new FileReader();

        reader.addEventListener("load", () => {
            let img = new Image,
                result = reader.result;

            img.onload = () => {
                let ratio = img.height / img.width,
                    scaledHeight = ratio * this.previewHeight;

                this.previewSrc = result;
                this.previewHeight = (scaledHeight < this.previewHeight)
                    ? this.previewHeight
                    : scaledHeight;
            };

            img.src = result;
        }, false);

        if (this.file) {
            reader.readAsDataURL(this.file);
        }
    }
}
