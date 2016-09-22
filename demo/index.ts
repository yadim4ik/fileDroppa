import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {DefaultModule} from './app.component'

platformBrowserDynamic().bootstrapModule(DefaultModule)
  .catch(err => console.error(err));
