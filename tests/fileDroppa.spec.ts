import {
    beforeEach,
    afterEach,
    ddescribe,
    xdescribe,
    describe,
    expect,
    iit,
    inject,
    beforeEachProviders,
    it,
    xit
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { SpyLocation } from '@angular/common/testing';
import { Component, ComponentResolver, ViewChild, ContentChild, provide, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';
import FileDroppa from '../components/Directives/FileDroppa';

// Needed because ViewChild isn't resolved anymore in the new router
// https://github.com/angular/angular/issues/4452
class GlueService {
    testComponent: TestComponent;
}


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
    let fixture: ComponentFixture<TestComponent>;
    let location: Location;
    let glue: GlueService;

    beforeEachProviders(() => [
        provide(Location, { useClass: SpyLocation }),
        GlueService
    ]);

    beforeEach(inject([TestComponentBuilder, Location, GlueService], (tcb, r, l, g) => {
        builder = tcb;
        location = l;
        glue = g;
    }));

    afterEach(() => {
        fixture && fixture.destroy();
    });

    it('should render', done => {
        builder.createAsync(TestComponent).then(f => {
            fixture = f;
            fixture.detectChanges();
            expect(document.querySelectorAll('.file-droppa-container').length).toBe(1);
            done();
        });
    });

});

