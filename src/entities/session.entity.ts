// 3d party imports
import { Moment } from 'moment';

// app imports
import { Room, Speaker } from './';

export interface Session {
  room?: number|Room;
  $key: string;
  title: string;
  description: string;
  startDate: Moment;
  endDate: Moment;
  tags?: Array<string>;
  speakers?: Array<number|Speaker>;
  favorite?: boolean;
}
