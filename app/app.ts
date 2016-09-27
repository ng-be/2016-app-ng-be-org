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
      apiKey: 'xxx',          // ask core member for details
      authDomain: 'xxx',      // ask core member for details
      databaseURL: 'xxx',     // ask core member for details
      storageBucket: 'xxx',   // ask core member for details
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
