// app imports
import { Session } from './';

export interface SessionGroup {
  startHour: number;
  endHour: number;
  sessions: Array<Session>;
  hidden?: boolean;
}
