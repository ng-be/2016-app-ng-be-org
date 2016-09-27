// 3d party imports
import { ionicBootstrap } from 'ionic-angular';
import { AuthProviders, AuthMethods, firebaseAuthConfig, defaultFirebase, FIREBASE_PROVIDERS } from 'angularfire2';

// app imports
import { ConferenceData, UserData } from './providers';
import { AppContainer } from './containers';

ionicBootstrap(AppContainer,
  [
    ConferenceData,
    UserData,
    FIREBASE_PROVIDERS,
    defaultFirebase({
      apiKey: 'AIzaSyDJ9fpXQhzbZSn7LVIUZ1fbv7yOqNz6gXw',
      authDomain: 'ngbe-3a883.firebaseapp.com',
      databaseURL: 'https://ngbe-3a883.firebaseio.com',
      storageBucket: 'ngbe-3a883.appspot.com',
    }),
    firebaseAuthConfig({
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
      remember: 'default',
      scope: ['email']
    })
  ],
  {}
);
