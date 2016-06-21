import {
    beforeEach,
    afterEach,
    describe,
    expect,
    inject,
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
    return new Blob([["<!doctype html><div>File</div>"]], {type:"text/html"});

};

@Component({
    selector: 'app-component',
    directives: [FileDroppa],
    template: `
        <fileDroppa></fileDroppa>
    `
})
class TestComponent {
}

describe('FileDroppa', () => {

    let builder: TestComponentBuilder;
    //let fixture: ComponentFixture<TestComponent>;

    beforeEach(inject([TestComponentBuilder], (tcb) => {
        builder = tcb;
    }));

    it('should render', done => {
        builder.createAsync(TestComponent).then(f => {
            expect(document.querySelectorAll('.file-droppa-container').length).toBe(1);
            done();
        });
    });

    it('adds file on drop', (done) => {
        builder.createAsync(TestComponent)
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
                    expect(fileDroppaComponent.filesStore.files.length).toBe(1);
                    done();
                });
            });
    });

    it('renders list', (done) => {
        builder.createAsync(TestComponent)
            .then(fixture => {
                let fileDropZone = fixture.debugElement.query(By.directive(FileDropZone));
                let event = <any>document.createEvent('MouseEvent');
                event.initEvent('drop', true, true);
                event.dataTransfer = {
                    files:[createFile()]
                };
                fileDropZone.nativeElement.dispatchEvent(event);
                fixture.detectChanges();
                fixture.debugElement.query(By.directive(FileDropZone)).componentInstance.promise.then(()=>{
                    expect(fixture.debugElement.query(By.directive(FileList))).toBeTruthy();
                    done();
                });
            });
    });

    it('doesnt render list when it diabled in config', (done) => {
        builder.createAsync(TestComponent)
            .then(fixture => {
                let fileDroppaComponent = fixture.debugElement.query(By.directive(FileDroppa)).componentInstance;
                fileDroppaComponent.showFilesList = false;
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
                    expect(fixture.debugElement.query(By.directive(FileList))).toBeFalsy();
                    done();
                });
            });
    });


    it('throws if no url given', (done) => {
        builder.createAsync(TestComponent)
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


    //it('enables autoUpload', (done) => {
        //TODO: IMPLEMENT!!
    //});

});

