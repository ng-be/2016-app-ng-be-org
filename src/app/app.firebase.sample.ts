/**
 * Rename to `app.firebase.ts` and fill in the correct information.
 */
import { AngularFireModule, AuthMethods } from 'angularfire2';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
};

const firebaseAuthConfig = {
  method: AuthMethods.Popup,
  remember: 'default'
};

export const FirebaseModule = AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig);
