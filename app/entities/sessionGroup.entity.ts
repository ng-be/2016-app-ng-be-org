// app imports
import { Session } from './session.entity';

export interface SessionGroup {
  startHour: number;
  endHour: number;
  sessions: Array<Session>;
}
