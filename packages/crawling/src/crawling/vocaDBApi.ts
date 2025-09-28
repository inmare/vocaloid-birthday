import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
import { VocaDBResponse, PV } from "./crawling.type";

// vocaDB API 관련 설정
const API_URL = new URL("https://vocadb.net");
const API_PATH = "/api/songs/";
API_URL.searchParams.set("fields", "PVs");

const VALID_PV_SERVICES = ["Youtube", "NicoNicoDouga", "Bilibili"];

export async function createSongInfo(
  vocaDBId: number
): Promise<VocaDBResponse> {
  const apiUrl = new URL(API_URL);
  apiUrl.pathname = `${API_PATH}${vocaDBId}`;

  console.log("VocaDB에서 정보를 가져오는 중입니다.");
  console.log("VocaDB URL:", apiUrl.toString());

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${apiUrl.toString()}: ${response.status}`);
  }

  const json = (await response.json()) as VocaDBResponse;

  console.log("PV 정보를 업데이트 하는 중입니다.");

  const pvs: PV[] = json.pvs;

  // 링크가 살아있는 오리지널 pv가 있는 곡들만 걸러냄
  // 일단은 유튜브, 니코동, 비리비리리에 대해서만 pv날짜 보정
  // 나머지의 경우에는 일단 무시함...
  const filteredPVs = pvs.filter((value) => {
    const isValid = !value.disabled;
    const isOriginal = value.pvType === "Original";
    const isValidService = VALID_PV_SERVICES.includes(value.service);
    return isValid && isOriginal && isValidService;
  });

  if (filteredPVs.length > 0) {
    // 잘못된 publishDate 수정
    for (const pv of filteredPVs) {
      if (!VALID_PV_SERVICES.includes(pv.service)) continue;

      const publishDate = await correctPublishDate(pv);
      pv.publishDate = publishDate;
    }

    // 가장 빠른 날짜로 데이터 업데이트
    const earliestPV = filteredPVs.reduce((prev, curr) => {
      const prevDate = dayjs(prev.publishDate);
      const currDate = dayjs(curr.publishDate);
      const isPrevEarlier = prevDate.isBefore(currDate);
      if (isPrevEarlier) return prev;
      else return curr;
    });

    json.publishDate = earliestPV.publishDate;
  }
  json.pvs = filteredPVs;

  return json;
}

async function correctPublishDate(pv: PV): Promise<string> {
  const dateFormat = "YYYY-MM-DDTHH:mm:ss";

  // 기존 pv데이터와의 통일성을 위해서 일단은 Date 대신 string을 반환함
  switch (pv.service) {
    case "Youtube": {
      const apiKey = process.env.YOUTUBE_API_KEY;
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${pv.pvId}&part=snippet&key=${apiKey}`;
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw Error("유튜브 관련 정보를 가져오던 중 에러가 발생했습니다.");
      const json = (await response.json()) as any;
      const uploadDate = dayjs(json.items[0].snippet.publishedAt);
      return uploadDate.format(dateFormat);
    }
    case "NicoNicoDouga": {
      const apiUrl = `https://ext.nicovideo.jp/api/getthumbinfo/${pv.pvId}`;
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw Error("니코동 관련 정보를 가져오던 중 에러가 발생했습니다.");
      const text = await response.text();
      const parser = new XMLParser();
      const json = parser.parse(text) as any;
      const dateString = json.nicovideo_thumb_response.thumb.first_retrieve;
      const uploadDate = dayjs(dateString);
      return uploadDate.format(dateFormat);
    }
    case "Bilibili": {
      const apiUrl = `https://api.bilibili.com/x/web-interface/view?aid=${pv.pvId}`;
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw Error("비리비리 관련 정보를 가져오던 중 에러가 발생했습니다.");
      const json = (await response.json()) as any;
      const dateNumber = json.data.pubdate;
      const uploadDate = dayjs.unix(dateNumber);
      return uploadDate.format(dateFormat);
    }
    default: {
      throw Error("올바르지 않은 PV 서비스를 입력했습니다.");
    }
  }
}
