// 모델의 속성 정의
export interface VideoAttributes {
  id?: number;
  url: string;
  uploadDate: string;
  videoId: string;
}

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
  lyrics?: string;
}

export interface PVAttributes {
  id?: number;
  songId: number;
  pvId: string;
  service: string;
}
