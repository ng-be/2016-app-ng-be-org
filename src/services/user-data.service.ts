// 3d party imports
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserDataService {

  private favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(public events: Events, public storage: Storage) {}

  hasFavorite(sessionName) {
    return (this.favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName) {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName) {
    let index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  setUsername(username) {
    this.storage.set('username', username);
  }

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }
}
