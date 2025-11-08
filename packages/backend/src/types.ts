export type AdminData = {
  isAdmin: boolean;
};
export type RefreshTokenData = {
  refreshTokens: string[];
};
export type CalendarData = {
  title: string;
  composer: string;
  titleKor: string;
  composerKor: string;
  calendarDate: Date;
  lyrics: string;
  svgConfig: object;
  songId: number;
};
