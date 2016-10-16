// 3d party imports
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';

// app imports
import { ConferenceApp } from './app.component';
import { APP_PAGES } from './app.pages';
import { APP_PROVIDERS } from './app.providers';
import { firebaseConfig } from './app.firebase';

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
    AngularFireModule.initializeApp(firebaseConfig)
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
