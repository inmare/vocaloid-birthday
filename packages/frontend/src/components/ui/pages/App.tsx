import api from "@/api";
import CustomNavLink from "@/components/ui/fragments/CustomNavLink";
import SongListDisplayer from "@/components/ui/fragments/SongListDisplayer";
import DatePicker from "@components/ui/datePicker/DatePicker";
import DateString from "@components/ui/fragments/DateString";
import SongTable from "@components/ui/fragments/SongTable";
import { type SongWithPVs } from "@vocaloid-birthday/common";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

function App() {
  const initMonth = dayjs().month() + 1;
  const initDate = dayjs().date();

  const [month, setMonth] = useState<number>(initMonth);
  const [date, setDate] = useState<number>(initDate);
  const [songList, setSongList] = useState<SongWithPVs[]>([]);
  const [currentSong, setCurrentSong] = useState<SongWithPVs | null>(null);

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

  return (
    <>
      <div className="grid h-dvh w-full grid-rows-[auto_1fr_auto]">
        <header className="relavite z-10">
          <div>
            <DatePicker setMonth={setMonth} setDate={setDate} />
          </div>
          <div className="flex content-center justify-center gap-4 p-3">
            <CustomNavLink to="/about">About</CustomNavLink>
            <CustomNavLink to="/progress">Progress</CustomNavLink>
          </div>
        </header>

        <main className="flex min-h-0 flex-col">
          <DateString month={month} date={date} />
          <hr className="mx-[20%] my-3 max-w-full" />
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
          <hr className="mx-[20%] my-3 max-w-full" />
        </main>

        <div className="m-auto flex max-w-[500px] content-center justify-center p-5">
          {currentSong ? (
            <SongTable song={currentSong} />
          ) : (
            <p>곡을 선택해주세요.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
