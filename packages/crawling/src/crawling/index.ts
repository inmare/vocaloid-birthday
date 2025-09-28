import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { createSongInfo } from "./vocaDBApi";
import { Song, PV } from "@vocaloid-birthday/database";
import dayjs from "dayjs";
import path from "path";
import { exec } from "child_process";

export async function crawlingFromVocaDB({ debug }: { debug: boolean }) {
  const debugSetting = {
    headless: false,
    slowmo: 250,
  };

  const setting = debug ? debugSetting : {};
  const browser = await puppeteer.launch(setting);
  const page = await browser.newPage();

  // VocaDB에서 원곡이면서 평점이 50점 이상인 곡 검색 페이지로 이동
  const searchPage = new URL("https://vocadb.net");
  searchPage.pathname = "/Search";
  searchPage.searchParams.set("searchType", "Song");
  searchPage.searchParams.set("songType", "Original");
  searchPage.searchParams.set("minScore", "30");

  let currentPage = 1;
  do {
    try {
      // 페이지 로드 대기
      searchPage.searchParams.set("page", String(currentPage));
      console.log(`Page ${currentPage} 크롤링 중...`);
      console.log("링크:", searchPage.toString());

      await page.goto(searchPage.toString(), {
        waitUntil: "networkidle0",
        timeout: 60_000,
      });

      await page.waitForSelector(".table");

      const content = await page.content();
      const $ = cheerio.load(content);

      // 테이블에서 링크 파싱
      console.log("곡 정보를 가져오는 중입니다.");
      const idList = parseInfoFromTable($);

      // 데이터 베이스에 데이터 추가
      console.log("데이터 베이스에 데이터를 추가하는 중입니다.");
      for (const id of idList) {
        try {
          const songInfo = await createSongInfo(id);
          const publishDate = dayjs(songInfo.publishDate).toDate();

          const song = await Song.create(
            {
              title: songInfo.defaultName,
              composer: songInfo.artistString,
              publishDate,
              vocaDBId: songInfo.id,
              vocaDBRating: songInfo.ratingScore,
            },
            {
              include: [PV],
            }
          );

          // Song에 PV추가
          for (const pv of songInfo.pvs) {
            await PV.create({
              pvId: pv.pvId,
              service: pv.service,
              songId: song.id,
            });
          }
        } catch (error) {
          console.error(
            "곡과 관련된 정보를 VocaDB에서 가져오는 도중 에러가 발생했습니다."
          );
          console.error(error);
        }
      }

      // 다음 페이지가 없으면 종료
      const isEndOfPage = checkEndOfPage($);
      if (isEndOfPage) {
        console.log("페이지의 끝에 도달했습니다.");
        break;
      }
    } catch (error) {
      console.error("VocaDB 웹페이지를 파싱하던 도중 에러가 발생했습니다.");
      console.error("에러가 발생한 페이지:", currentPage);
      console.error(error);
    } finally {
      // 사이트의 부하를 피하기 위해서 2초동안 쉬기
      if (!debug) {
        console.log("2초간 대기");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // 다음 페이지로 이동
      currentPage += 1;
    }
  } while (true);

  await browser.close();

  if (process.platform === "win32") {
    const fileDir = path.join(__dirname, "../../Miku-Ringtone.mp3");
    const command = `start ${fileDir}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("명령어 실행 중 오류 발생:", error.message);
        return;
      }
      if (stderr) {
        console.error("stderr:", stderr);
        return;
      }
    });
  }

  console.log("크롤링 작업이 완료되었습니다.");
}

function parseInfoFromTable($: cheerio.CheerioAPI): number[] {
  console.log("table 파싱 중...");
  const table = $(".table");
  const rows = table.find("tbody > tr");

  const famousSongs: number[] = [];

  rows.each((_index, element) => {
    const a = $(element).find("td:nth-child(2) > a");
    const link = a.attr("href");
    if (!link) return; // 링크가 없으면 패스

    // 링크에서 vocadb 정보 얻기"
    const lastPath = link.split("/").pop() || "";
    const vocaDBId = parseInt(lastPath);

    if (!isNaN(vocaDBId)) famousSongs.push(vocaDBId);
  });

  return famousSongs;
}

function checkEndOfPage($: cheerio.CheerioAPI): boolean {
  console.log("마지막 페이지인지 확인 중...");
  // Next 버튼 찾기
  const nextButton = $(".pagination li:nth-last-child(2)");
  const isDisabled = nextButton.hasClass("disabled");
  return isDisabled;
}
