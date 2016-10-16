export interface SpeakerRating{
  speakerId: string;
  rating: number;
  firstname?: string;
  name?: string;
  avatar?: string;
}

export interface Rating {
  $key?: string,
  sessionId: string;
  speakers: SpeakerRating[];
  rating: number;
  remarks?: string;
  $exists?: Function;
}
