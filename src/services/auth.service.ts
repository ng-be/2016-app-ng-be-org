// 3d party imports
import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { BehaviorSubject } from 'rxjs';

// app imports

@Injectable()
export class AuthService {

  private authState: FirebaseAuthState = null;
  rpCurrentUser$ = new BehaviorSubject<any>(null);

  constructor(public auth$: FirebaseAuth) {
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      if (state) {
        if (state.provider == AuthProviders.Twitter && state.twitter.displayName) {
          this.rpCurrentUser$.next(state.twitter);
        }
        if (state.provider == AuthProviders.Github && state.github.displayName) {
          this.rpCurrentUser$.next(state.github);
        }
        if (state.provider == AuthProviders.Google && state.google.displayName) {
          this.rpCurrentUser$.next(state.google);
        }
        if (state.provider == AuthProviders.Facebook && state.facebook.displayName) {
          this.rpCurrentUser$.next(state.facebook);
        }
      }
    });
  }

  constructor(public auth$: FirebaseAuth) {
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get id(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  signIn(provider: number): Promise<FirebaseAuthState> {
    return this.auth$.login({provider})
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signInWithFacebook(): Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Facebook);
  }

  signInWithGithub(): Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Github);
  }

  signInWithGoogle(): Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Google);
  }

  signInWithTwitter(): Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Twitter);
  }

  signOut(): void {
    this.auth$.logout();
    this.rpCurrentUser$.next(null);
    this.toastCtrl
  }
}
