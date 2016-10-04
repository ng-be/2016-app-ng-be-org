// app imports
import { Session } from './';

export interface Speaker {
  firstName: string;
  lastName: string;
  description: string;
  $key: string;
  role: string;
  tweetName: string;
  img: string;
  sessions: Array<Session>;
  phone?: string;
  email?: string;
}
