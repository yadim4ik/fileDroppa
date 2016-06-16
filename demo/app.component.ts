///<reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import {Component, EventEmitter} from '@angular/core';
import FileDroppa from '../index'

@Component({
    selector: 'my-app',
    directives: [FileDroppa],
    template: `<fileDroppa>
               </fileDroppa>`
})
export class AppComponent {
}
