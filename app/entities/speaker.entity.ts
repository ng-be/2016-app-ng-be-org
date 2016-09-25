import { Session } from "./session.entity";
export interface Speaker {
  firstName: string;
  lastName: string;
  description: string;
  $key: string;
  role: string;
  tweetName: string;
  img: string;
  sessions: Array<Session>;
}
