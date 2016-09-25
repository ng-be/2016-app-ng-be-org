// 3d party imports
import { ionicBootstrap } from "ionic-angular";
import { AuthProviders, AuthMethods, firebaseAuthConfig, defaultFirebase, FIREBASE_PROVIDERS } from "angularfire2";

// app imports
import { ConferenceData } from "./providers/conference-data";
import { UserData } from "./providers/user-data";
import { AppContainer } from "./containers/app.container";

ionicBootstrap(AppContainer, [ConferenceData, UserData,
  FIREBASE_PROVIDERS,
  defaultFirebase({
    apiKey: 'xxx',
    authDomain: 'xxx',
    databaseURL: 'xxx',
    storageBucket: 'xxx',
  }),
  firebaseAuthConfig({
    provider: AuthProviders.Password,
    method: AuthMethods.Password,
    remember: "default",
    scope: ["email"]
  })], {});
