import type { Updater } from "use-immer";

export type DateSelectMode = "month" | "date";
export type VisibilityState = "show" | "hide";

// 달력의 날짜 데이터 타입
export type DateData = {
  value: number | null;
  finished?: boolean;
};

// 텍스트 관련 설정 타입
export type TextTypo = {
  offsetX: number;
  offsetY: number;
  leading: number;
};
export const DefaultTextTypo: TextTypo = {
  offsetX: 0,
  offsetY: 0,
  leading: 0,
} as const;
export type TextItem = {
  id: number;
  text: string;
  typo: TextTypo;
  selected: boolean;
};
export type TextConfig = {
  fontSize: number;
  lineHeight: number;
  items: TextItem[][];
};

// svg 관련 설정 타입
export type SvgConfig = {
  title: TextConfig;
  composer: TextConfig;
  fragment: FragemntConfig;
  updateTitle: Updater<TextConfig>;
  updateComposer: Updater<TextConfig>;
  updateFragment: Updater<FragemntConfig>;
};
export type DataConfig = {
  data: TextConfig;
  updateData: Updater<TextConfig>;
};
export type FragemntConfig = {
  accentColor: string;
  lyrics: string;
  titleKor: string;
  composerKor: string;
  imageLink: string | null;
  imageX: number;
  imageY: number;
  imageScale: number;
};
