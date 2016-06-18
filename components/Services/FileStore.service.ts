import {Injectable, EventEmitter} from "@angular/core";
import {FileUpload} from "./FileUpload.service";
import {iFile} from "./FileWrapper.service";
import {FileWrapper} from "./FileWrapper.service";

@Injectable()
export class FilesStore {
    public filesUpdated = new EventEmitter(true);

    public beforeAddFile:any = null;

    private WSfiles:WeakSet<File> = new WeakSet();
    private _iFiles:Array<iFile> = [];

    public get files():Array<File> {
        return this.iFiles.reduce((res, iFile:iFile)=> {
            res.push(iFile.File);
            return res;
        }, []);
    }

    public get iFiles() {
        return this._iFiles;
    }

    public set iFiles(files) {
        this._iFiles = files;
    }

    public addFiles(files):void {
        files = files.filter((file)=> {
            if (!this.WSfiles.has(file)) {
                if(typeof this.beforeAddFile === "function" && this.beforeAddFile(file)){
                    this.WSfiles.add(file);
                    return true;
                } else if(typeof this.beforeAddFile !== "function") {
                    return true;
                }
                return false;
            }
        }).map((file)=> {
            return new FileWrapper(file);
        });
        this.iFiles = [...this.iFiles, ...files];
        this.filesUpdated.emit(true);
    }

    public removeFiles(iFile:iFile):void {
        this.WSfiles.delete(iFile.File);
        this.iFiles = this.iFiles.filter((item)=>{
            return item.id !== iFile.id;
        });
        this.filesUpdated.emit(true);
    }

    public clearStore():void {
        this.iFiles.forEach((iFile)=> {
            this.WSfiles.delete(iFile.File);
        });
        this.iFiles = [];
        this.filesUpdated.emit(true);
    }
}