// 3d party imports
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';

// app imports
import { ConferenceApp } from './app.component';
import { APP_PAGES } from './app.pages';
import { APP_PROVIDERS } from './app.providers';

export const firebaseConfig = {
  apiKey: 'AIzaSyDJ9fpXQhzbZSn7LVIUZ1fbv7yOqNz6gXw',
  authDomain: 'ngbe-3a883.firebaseapp.com',
  databaseURL: 'https://ngbe-3a883.firebaseio.com',
  storageBucket: 'ngbe-3a883.appspot.com',
};

@NgModule({
  declarations: [
    ConferenceApp,
    ...APP_PAGES
  ],
  imports: [
    IonicModule.forRoot(ConferenceApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    ...APP_PAGES
  ],
  providers: [
    Storage,
    ...APP_PROVIDERS
  ]
})
export class AppModule {}
