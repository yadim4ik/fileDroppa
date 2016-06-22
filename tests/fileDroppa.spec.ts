import {
    beforeEach,
    afterEach,
    describe,
    expect,
    inject,
    async,
    beforeEachProviders,
    it
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component, ComponentResolver, ViewChild, ContentChild, provide, OnDestroy, Input } from '@angular/core';
import {By} from '@angular/platform-browser';
import FileDroppa from '../components/Directives/FileDroppa';
import {FileDropZone} from "../components/Directives/FileDropZone";
import {FileList} from "../components/Directives/FileList";

const createFile = ()=> {
    var blob = new Blob([["<!doctype html><div>File</div>"]], {type:"text/html"});
    return new File([blob], 'blob.html');
};

@Component({
    selector: 'app-component',
    directives: [FileDroppa],
    template: `
        <fileDroppa></fileDroppa>
    `
})
class TestComponentNoInput {
}

@Component({
    selector: 'app-component',
    directives: [FileDroppa],
    template: `
        <fileDroppa
                    [url]="'https://salty-taiga-80701.herokuapp.com/upload'"
                    [beforeRequest]="beforeRequest"
                    [beforeFileUpload]="beforeFileUpload"
                    [beforeAddFile]="beforeAddFile"
                    (filesUpdated)="filesUpdated($event)"
                    (fileUploaded)="fileUploaded($event)"
        ></fileDroppa>
    `
})
class TestComponent {
    public fileUploadedCalled = false;
    public filesUpdatedCalled = false;
    public beforeRequstCalled = false;
    public beforeFileUploadCalled = false;
    public beforeAddFileCalled = false;

    constructor(){
        this.fileUploaded = this.fileUploaded.bind(this);
        this.filesUpdated = this.filesUpdated.bind(this);
        this.beforeRequest = this.beforeRequest.bind(this);
        this.beforeFileUpload = this.beforeFileUpload.bind(this);
        this.beforeAddFile = this.beforeAddFile.bind(this);
    }
    fileUploaded(success, response, file){
        this.fileUploadedCalled = true;
    }

    filesUpdated(files) {
        this.filesUpdatedCalled = true;
    }

    beforeRequest(xhr){
        this.beforeRequstCalled = true;
    }

    beforeFileUpload(formData){
        this.beforeFileUploadCalled = true;
        return formData;
    }

    beforeAddFile(file){
        this.beforeAddFileCalled = true;
        return true;
    }
}

describe('FileDroppa', () => {

    let builder: TestComponentBuilder,
        fileDroppaComponent,
        fileAddedPromise,
        fileDropZone;

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(inject([TestComponentBuilder], (tcb) => {
        builder = tcb;
    }));

    describe("testing INPUT parameters", ()=>{
        beforeEach(async(() => {
            builder.createAsync(TestComponent).then(f => {
                fixture = f;
                fileDroppaComponent = fixture.debugElement.query(By.directive(FileDroppa)).componentInstance;
                fileDropZone = fixture.debugElement.query(By.directive(FileDropZone));
                fixture.detectChanges();

                let event = <any>document.createEvent('MouseEvent');
                event.initEvent('drop', true, true);
                event.dataTransfer = {
                    files:[createFile()]
                };
                fileDropZone.nativeElement.dispatchEvent(event);
                fileAddedPromise = fixture.debugElement.query(By.directive(FileDropZone)).componentInstance.promise;
            });
        }));

        it('should render', () => {
            expect(document.querySelectorAll('.file-droppa-container').length).toBe(1);
        });

        it('adds file on drop', (done) => {
            fileAddedPromise.then(()=>{
                expect(fileDroppaComponent.filesStore.files.length).toBe(1);
                done();
            });
        });

        it('renders files list', (done) => {
            fileAddedPromise.then(()=>{
                expect(fixture.debugElement.query(By.directive(FileList))).toBeTruthy();
                done();
            });
        });

        it('doesnt render list when it diabled in config', (done) => {
            fileDroppaComponent.showFilesList = false;
            fixture.detectChanges();
            fileAddedPromise.then(()=>{
                expect(fixture.debugElement.query(By.directive(FileList))).toBeFalsy();
                done();
            });
        });


        it('throws if no url given', (done) => {
            builder.createAsync(TestComponentNoInput)
                .then(fixture => {
                    let fileDroppaComponent = fixture.debugElement.query(By.directive(FileDroppa)).componentInstance;
                    let fileDropZone = fixture.debugElement.query(By.directive(FileDropZone));
                    fixture.detectChanges();
                    let event = <any>document.createEvent('MouseEvent');
                    event.initEvent('drop', true, true);
                    event.dataTransfer = {
                        files:[createFile()]
                    };
                    fileDropZone.nativeElement.dispatchEvent(event);
                    fixture.detectChanges();
                    fixture.debugElement.query(By.directive(FileDropZone)).componentInstance.promise.then(()=>{
                        expect(()=>{
                            fileDroppaComponent.uploadAllFiles()
                        }).toThrow();
                        done();
                    });
                });
        });

        it('enables autoUpload', (done) => {
            fileDroppaComponent.autoUpload = true;
            fileDroppaComponent.showFilesList = false;
            fixture.detectChanges();
            let event = <any>document.createEvent('MouseEvent');
            event.initEvent('drop', true, true);
            event.dataTransfer = {
                files:[createFile()]
            };
            fileDropZone.nativeElement.dispatchEvent(event);
            fileAddedPromise.then(()=>{
                expect(fixture.debugElement.componentInstance.beforeFileUploadCalled).toBe(true);
                done();
            });
        });

    });

});

