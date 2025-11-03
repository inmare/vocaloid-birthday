import api from "@/api";
import { useAuth } from "@components/AuthContext";
import Calendar from "@components/ui/fragments/Calendar";
import DateString from "@components/ui/fragments/DateString";
import SongListDisplayer from "@components/ui/fragments/SongListDisplayer";
import SvgViewer from "@components/ui/svg/SvgViewer";
import type { SongWithPVs } from "@vocaloid-birthday/common";
import { useEffect, useState } from "react";
import SongTable from "../fragments/SongTable";

export default function Progress() {
  const { accessToken } = useAuth();
  const isAdmin = !!accessToken;

  const [month, setMonth] = useState<number>(1);
  const [date, setDate] = useState<number>(1);

  const [currentSong, setCurrentSong] = useState<SongWithPVs | null>(null);
  const [songList, setSongList] = useState<SongWithPVs[]>([]);

  useEffect(() => {
    document.title = "Progress";
  }, []);

  useEffect(() => {
    const getSongData = async () => {
      try {
        const response = await api.post("/api/songs", { month, date });
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

  return (
    <>
      <div className="grid h-full grid-cols-2">
        <div className="grid min-h-0 grid-rows-[auto_auto_1fr_auto]">
          <div>
            <Calendar
              month={month}
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
        <div className="min-h-0">
          <SvgViewer month={month} date={date} isAdmin={isAdmin} />
        </div>
      </div>
    </>
  );
}
