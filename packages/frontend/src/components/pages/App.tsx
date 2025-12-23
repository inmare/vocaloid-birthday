import api from "@/api";
import DatePicker from "@components/datePicker/DatePicker";
import DateString from "@components/fragments/DateString";
import SongListDisplayer from "@components/fragments/SongListDisplayer";
import StyledNavLink from "@components/ui/StyledNavLink";
import { type SongWithPVs } from "@vocaloid-birthday/common";
import clsx from "clsx";
import dayjs from "dayjs";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SongTable } from "../fragments";

function App() {
  const initMonth = dayjs().month() + 1;
  const initDate = dayjs().date();

  const [month, setMonth] = useState<number>(initMonth);
  const [date, setDate] = useState<number>(initDate);
  const [songList, setSongList] = useState<SongWithPVs[]>([]);
  const [currentSong, setCurrentSong] = useState<SongWithPVs | null>(null);
  const [showTable, setShowTable] = useState(false);

  // 초기값을 ref에 저장 (DatePicker가 리렌더링 될 때마다 initMonth, initDate가 바뀌는 것을 방지)
  const initMonthRef = useRef<number>(initMonth);
  const initDateRef = useRef<number>(initDate);

  const realDateString = date === 0 ? "전체" : date + "일";
  const dateString = month + "월 " + realDateString;
  const pageTitle = `${dateString}의 보카로 곡은?`;
  document.title = pageTitle;

  useEffect(() => {
    try {
      const getData = async () => {
        const response = await api.get("/api/songs", {
          params: { month, date },
        });

        if (response.status !== 200) {
          throw new Error(
            response.data.message ||
              "데이터를 불러오던 중 에러가 발생했습니다.",
          );
        } else {
          const songList: SongWithPVs[] = response.data;
          setSongList(songList);
        }
      };
      getData();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  }, [month, date]);

  const handleSong = (song: SongWithPVs) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    setMonth(initMonthRef.current);
    setDate(initDateRef.current);
  }, []);

  const handleTable = () => {
    if (currentSong) setShowTable(!showTable);
  };

  return (
    <>
      <div className="grid h-dvh w-full grid-rows-[auto_1fr_auto]">
        <header className="relavite z-10">
          <div>
            <DatePicker setMonth={setMonth} setDate={setDate} />
          </div>
          <div className="flex content-center justify-center gap-4 p-3">
            <StyledNavLink to="/about">About</StyledNavLink>
            <StyledNavLink to="/2026">2026 Calendar</StyledNavLink>
          </div>
        </header>

        <main className="flex min-h-0 flex-col">
          <DateString month={month} date={date} />
          <hr className="mx-[20%] my-3 max-w-full" />
          {/* 메인 곡 목록 */}
          <div className="relative min-h-0 flex-1 bg-zinc-800">
            <div className="h-full w-full content-center justify-center overflow-y-auto">
              <SongListDisplayer
                songList={songList}
                currentSong={currentSong}
                handleSong={handleSong}
                pad={true}
              />
            </div>
            <div className="pointer-events-none absolute top-0 right-0 left-0 h-16 bg-linear-to-b from-zinc-900 to-transparent"></div>
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-linear-to-t from-zinc-900 to-transparent"></div>
          </div>
          {/* 곡 테이블 및 정보 */}
          <button
            className={clsx("mx-auto transition-all duration-100", {
              "cursor-pointer opacity-100 hover:scale-120 active:scale-120":
                currentSong,
              "opacity-50": !currentSong,
            })}
            onClick={handleTable}
          >
            {showTable ? (
              <ChevronsDown strokeWidth={4} />
            ) : (
              <ChevronsUp strokeWidth={4} />
            )}
          </button>
          <hr className="mx-[20%] my-3 max-w-full" />
          <div
            className={clsx(
              "overflow-hidden transition-all duration-150 ease-in-out",
              {
                "max-h-100 opacity-100": showTable,
                "max-h-10 opacity-0": !showTable,
              },
            )}
          >
            <div className="mx-auto max-w-[500px] justify-center p-5">
              <SongTable song={currentSong} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
