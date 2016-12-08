// 3d party imports
import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

// app imports
import { AppModuleNgFactory } from './app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
