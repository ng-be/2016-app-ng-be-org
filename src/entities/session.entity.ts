// 3d party imports
import { Moment } from 'moment';

export interface Session {
  speakerId: number;
  roomId: number;
  $key: string;
  title: string;
  description: string;
  startDate: Moment;
  endDate: Moment;
  favorite?: boolean;
}
