// 3d party imports
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// app imports
import { ConferenceApp } from './app.component';
import { APP_PAGES } from './app.pages';
import { APP_PROVIDERS } from './app.providers';
import { FirebaseModule } from './app.firebase';

import { AcStar, AcStars } from '../pages/rate-session/components'

const APP_COMPONENTS = [
  AcStar,
  AcStars
];

@NgModule({
  declarations: [
    ConferenceApp,
    ...APP_COMPONENTS,
    ...APP_PAGES
  ],
  imports: [
    IonicModule.forRoot(ConferenceApp),
    FirebaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    ...APP_COMPONENTS,
    ...APP_PAGES,
  ],
  providers: [
    Storage,
    ...APP_PROVIDERS
  ]
})
export class AppModule {
}
