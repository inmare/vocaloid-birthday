import api from "@/api";
import SongListDisplayer from "@/components/fragments/SongListDisplayer";
import SongTable from "@/components/fragments/SongTable";
import ProgressCalendar from "@/components/svgEditor/ProgressCalendar";
import SvgViewer from "@/components/svgEditor/SvgViewer";
import type { DateData } from "@/components/type";
import DateString from "@/components/ui/DateString";
import { useAuth } from "@components/AuthContext";
import { SvgProvider } from "@components/SvgProvider";
import type { SongWithPVs } from "@vocaloid-birthday/common";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Progress() {
  const { accessToken } = useAuth();
  const isAdmin = !!accessToken;

  const [month, setMonth] = useState<number>(1);
  const [date, setDate] = useState<number>(1);
  const [dateArray, setDateArray] = useState<DateData[]>([]);

  const [currentSong, setCurrentSong] = useState<SongWithPVs | null>(null);
  const [songList, setSongList] = useState<SongWithPVs[]>([]);

  useEffect(() => {
    document.title = "Progress";
  }, []);

  useEffect(() => {
    const getSongData = async () => {
      try {
        const response = await api.get("/api/songs", {
          params: { month, date },
        });
        const json = response.data;

        if (response.status !== 200) {
          throw new Error(
            json.message || "데이터를 불러오던 중 에러가 발생했습니다.",
          );
        } else {
          const songList: SongWithPVs[] = json;
          setSongList(songList);

          // console.log(songList);
        }
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    };

    getSongData();
  }, [month, date]);

  const handleSong = (song: SongWithPVs) => {
    setCurrentSong(song);
  };

  const fetchProgress = async () => {
    // 한 달의 날짜만큼 미리 날짜를 만들어 둠
    const month2026 = dayjs("2026").set("month", month - 1);
    const daysInMonth = month2026.daysInMonth();
    const dateArray: DateData[] = Array.from(
      {
        length: daysInMonth,
      },
      (_, index) => {
        return { value: index + 1 };
      },
    );

    try {
      const progressRes = await api.get("/api/progress", {
        params: { month },
      });

      const progressData: { progress: boolean[] } = progressRes.data;

      progressData.progress.forEach((finished, index) => {
        if (dateArray[index]) dateArray[index].finished = finished;
      });
    } catch (error) {
      console.error("데이터를 불러오던 중 에러가 발생했습니다:", error);
    }

    // 시작하는 요일 반환
    const startDay = month2026.startOf("month").day();
    // 배열 앞의 빈 부분을 null로 채움
    for (let i = 0; i < startDay; i++) {
      dateArray.unshift({ value: null });
    }
    // 배열 뒤의 빈 부분을 null로 채움
    while (dateArray.length % 7 !== 0) {
      dateArray.push({ value: null });
    }
    setDateArray(dateArray);
  };

  useEffect(() => {
    fetchProgress();
  }, [month]);

  return (
    <SvgProvider>
      <div className="grid h-full grid-cols-2">
        <div className="grid min-h-0 grid-rows-[auto_auto_1fr_auto]">
          <div>
            <ProgressCalendar
              month={month}
              date={date}
              dateArray={dateArray}
              setMonth={setMonth}
              setDate={setDate}
              setCurrentSong={setCurrentSong}
            />
          </div>
          <DateString month={month} date={date} />
          <div className="overflow-y-auto">
            <SongListDisplayer
              currentSong={currentSong}
              songList={songList}
              handleSong={handleSong}
              pad={false}
            />
          </div>
          <div className="p-5 text-center">
            {currentSong !== null ? (
              <SongTable song={currentSong} />
            ) : (
              "곡을 선택해주세요"
            )}
          </div>
        </div>
        <div className="mx-auto min-h-0 w-full overflow-auto">
          <SvgViewer
            month={month}
            date={date}
            isAdmin={isAdmin}
            fetchProgress={fetchProgress}
          />
        </div>
      </div>
    </SvgProvider>
  );
}
