// app imports
import { Session } from './';

export interface Speaker {
  firstname: string;
  name: string;
  description: string;
  $key: string;
  role: string;
  twitter: string;
  github: string;
  avatar: string;
  sessions?: Array<Session>;
}
