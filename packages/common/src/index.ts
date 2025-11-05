const DB_FILE_NAME = "db.sqlite";
export { DB_FILE_NAME };

export interface SongAttributes {
  id?: number;
  title: string;
  composer: string;
  publishDate: Date;
  vocaDBId?: number;
  vocaDBRating?: number;
  titleKr?: string;
  composerKr?: string;
}

export interface PVAttributes {
  id?: number;
  songId: number;
  pvId: string;
  service: string;
  publishDate: Date;
}

export interface SongWithPVs extends SongAttributes {
  PVs: PVAttributes[];
}

export interface CalendarAttributes {
  id?: number;
  title: string;
  composer: string;
  titleKor: string;
  composerKor: string;
  publishDate: Date;
  calendarDate: Date;
  lyrics: string;
  svgConfig: object;
  svgFileName: string;
  songId: number;
}
