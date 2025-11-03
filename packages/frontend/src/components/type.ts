export type DateSelectMode = "month" | "date";
export type VisibilityState = "show" | "hide";

export type TextTypo = {
  offsetX: number;
  offsetY: number;
  leading: number;
};
export type TextItemConfig = {
  id: number;
  text: string;
  typo: TextTypo;
};
export type LineConfig = {
  item: TextItemConfig[];
};
export type TitleConfig = {
  fontSize: number;
  leading: number;
  line: LineConfig[];
};
export const DefaultTextTypo: TextTypo = {
  offsetX: 0,
  offsetY: 0,
  leading: 0,
} as const;
export const DefaultTitleConfig = {
  fontSize: 12,
  leading: 0,
} as const;
