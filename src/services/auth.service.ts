// 3d party imports
import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

// app imports

@Injectable()
export class AuthService {

  private authState: FirebaseAuthState = null;
  rpCurrentUser$ = new BehaviorSubject<any>(null);
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private auth$: FirebaseAuth,
              private storage: Storage) {
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      if (state) {
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

  signOut(): void {
    this.auth$.logout();
    this.rpCurrentUser$.next(null);
    this.isAuthenticated$.next(false);
  }
}
