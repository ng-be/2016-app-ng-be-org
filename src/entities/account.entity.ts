import { AuthProviders } from 'angularfire2';

export interface Account {
  provider: AuthProviders;
  email?: string;
  name?: string;
}
