import { DefaultTextTypo, type TextItem } from "@components/type";
import dayjs from "dayjs";
import nihongo from "nihongo";

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

  public array(): [number, number] {
    return [this.x, this.y];
  }

  static toStyle(vectors: Vec2[]): string {
    let str = "";
    for (const vec of vectors) {
      str += `${vec.x} ${vec.y} `;
    }

    return `translate(${str.trim()})`;
  }
}

/**
 * 이미지 URL을 base64로 인코딩합니다.
 * @param url 입력할 이미지의 url
 * @returns base64로 인코딩된 이미지 string
 */
export async function imageToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * 빈 TextConfig용 임시 아이템을 생성합니다.
 * @returns 빈 TextItem 객체
 */
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

/**
 * TextItem의 2차원 배열에서 텍스트만 전부 합친 문자열을 반환합니다.
 * @param itemMatrix TextItem의 2차원 배열
 * @returns 배열의 텍스트만 전부 합친 문자열
 */
export function getTextFromItems(itemMatrix: TextItem[][]): string | null {
  let result = "";
  itemMatrix.forEach((line) => {
    line.forEach((item) => {
      result += item.text;
    });
    result += "\n";
  });
  return result !== "" ? result : null;
}

/**
 * TextConfig 객체에서 상용한자가 아닌 일본어가 있는지 확인합니다.
 * @param config TextConfig 객체
 * @returns 상용한자가 아닌 일본어가 있는지의 여부
 */
export function hasOnlyJouyouKanji(text: string): boolean {
  for (const char of text) {
    // 글자에 상용한자가 아닌 한자가 포함되어 있는지 확인
    // 일본어이지만, 히라가나/가타카나가 아니면서 상용한자가 아닌 경우
    const condition =
      nihongo.isJapanese(char) &&
      !nihongo.isKana(char) &&
      !nihongo.isJouyouKanji(char);
    if (condition) {
      console.log("상용한자가 아닌 한자가 있습니다:", char);
      return false;
    }
  }
  return true;
}
