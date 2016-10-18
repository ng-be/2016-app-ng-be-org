// 3d party imports
import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, FirebaseAuth, FirebaseAuthState, AngularFire } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5'

// app imports

@Injectable()
export class AuthService {

  private authState: FirebaseAuthState = null;
  rpCurrentUser$ = new BehaviorSubject<any>(null);
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private auth$: FirebaseAuth,
              private af: AngularFire,
              private storage: Storage) {

    auth$.subscribe((state: FirebaseAuthState) => {
      this.handleState(state);
    });

  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get id(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  signIn(provider: number): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({provider})
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Facebook);
  }

  signInWithGithub(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Github);
  }

  signInWithGoogle(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Google);
  }

  signInWithTwitter(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Twitter);
  }

  signupEmailPassword(user): firebase.Promise<FirebaseAuthState> {
    let cred = {
      email: user.email,
      password: user.password
    };
    return this.af.auth.createUser(cred);
  }

  loginEmailPassword(user): firebase.Promise<FirebaseAuthState> {
    return this.af.auth.login(user, {provider: AuthProviders.Password, method: AuthMethods.Password});
  }

  signOut(): void {
    this.auth$.logout();
    this.rpCurrentUser$.next(null);
    this.isAuthenticated$.next(false);
  }

  handleState(state: FirebaseAuthState) {
    this.authState = state;

    if (state) {
      if (state.provider == AuthProviders.Password) {
        this.storage.get('registername').then((name)=> {
          let user = {
            uid: state.auth.uid,
            displayName: name,
            email: state.auth.email,
            photoURL: 'https://www.gravatar.com/avatar/' + Md5.hashStr(state.auth.email)
          };
          this.rpCurrentUser$.next(user);
          this.isAuthenticated$.next(true);
        });
      }
      if (state.provider == AuthProviders.Twitter && state.twitter.displayName) {
        this.rpCurrentUser$.next(state.twitter);
        this.isAuthenticated$.next(true);
      }
      if (state.provider == AuthProviders.Twitter && state.twitter.displayName) {
        this.rpCurrentUser$.next(state.twitter);
        this.isAuthenticated$.next(true);
        this.storage.set('previousLoginMethod', 'Twitter');
      }
      if (state.provider == AuthProviders.Github && state.github.displayName) {
        this.rpCurrentUser$.next(state.github);
        this.isAuthenticated$.next(true);
        this.storage.set('previousLoginMethod', 'Github');
      }
      if (state.provider == AuthProviders.Google && state.google.displayName) {
        this.rpCurrentUser$.next(state.google);
        this.isAuthenticated$.next(true);
        this.storage.set('previousLoginMethod', 'Google');
      }
      if (state.provider == AuthProviders.Facebook && state.facebook.displayName) {
        this.rpCurrentUser$.next(state.facebook);
        this.isAuthenticated$.next(true);
        this.storage.set('previousLoginMethod', 'Facebook');
      }
    }
  }
}
