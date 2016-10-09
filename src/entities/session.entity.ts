// 3d party imports
import { Moment } from 'moment';

// app imports
import { Room, Speaker } from './';

export interface Session {
  roomId: number;
  room?: Room;
  $key: string;
  title: string;
  description: string;
  startDate: Moment;
  endDate: Moment;
  tags?: Array<string>;
  speakerIds: Array<number>;
  speakers?: Array<Speaker>;
  favorite?: boolean;
}
