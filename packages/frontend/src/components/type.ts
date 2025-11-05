import type { Updater } from "use-immer";

export type DateSelectMode = "month" | "date";
export type VisibilityState = "show" | "hide";

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
export type SvgConfig = {
  title: TextConfig;
  composer: TextConfig;
  updateTitle: Updater<TextConfig>;
  updateComposer: Updater<TextConfig>;
};
export type DataConfig = {
  data: TextConfig;
  updateData: Updater<TextConfig>;
};
