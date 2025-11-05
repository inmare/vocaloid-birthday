import dayjs from "dayjs";
import { DefaultTextTypo, type TextItem } from "./type";

export function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getMaxDate(month: number): number {
  const date = dayjs(`2024-${month}-1`);
  // 윤년으로 설정해서 2월 29일을 반환할 수 있게 함
  return date.daysInMonth();
}

export class Vec2 {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static toStyle(vectors: Vec2[]): string {
    let str = "";
    for (const vec of vectors) {
      str += `${vec.x},${vec.y} `;
    }

    return str.trim();
  }
}

export function createEmptyItem(): TextItem {
  return {
    id: dayjs().valueOf(),
    text: "",
    typo: {
      ...DefaultTextTypo,
    },
    selected: false,
  };
}
