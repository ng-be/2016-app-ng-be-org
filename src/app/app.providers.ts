import {
  UserDataService,
  AuthService,
  ConferenceDataService,
  ConnectionService
} from '../services';

export const APP_PROVIDERS = [
  ConnectionService,
  UserDataService,
  AuthService,
  ConferenceDataService
];
