import { useRef, useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import SongListDisplayer from "./SongListDisplayer";
import SongTable from "./SongTable";
import dayjs from "dayjs";
import { type SongAttributes } from "@vocaloid-birthday/common";
import styled from "styled-components";

const API_ENDPOINT = "http://localhost:3000/api";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100dvh;

  .song-display-section {
    overflow-y: auto;
  }

  .song-info-section {
    overflow-x: auto;
  }
`;

function App() {
  const initMonth = dayjs().month() + 1;
  const initDate = dayjs().date();

  const [month, setMonth] = useState<number>(initMonth);
  const [date, setDate] = useState<number>(initDate);
  const [songList, setSongList] = useState<SongAttributes[]>([]);
  const [currentSong, setCurrentSong] = useState<SongAttributes | null>(null);

  // 초기값을 ref에 저장 (DatePicker가 리렌더링 될 때마다 initMonth, initDate가 바뀌는 것을 방지)
  const initMonthRef = useRef<number>(initMonth);
  const initDateRef = useRef<number>(initDate);

  const realDateString = date === 0 ? "전체" : date + "일";
  const dateString = month + "월 " + realDateString;
  const pageTitle = `${dateString}의 보카로 곡은?`;
  document.title = pageTitle;

  const handleDate = async (month: number, date: number) => {
    setMonth(month);
    setDate(date);
    setCurrentSong(null);

    try {
      const response = await fetch(API_ENDPOINT + "/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ month, date }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json.message || "데이터를 불러오던 중 에러가 발생했습니다."
        );
      } else {
        const songList: SongAttributes[] = json;
        setSongList(songList);

        // console.log(songList);
      }
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  };

  const handleSong = (song: SongAttributes) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    handleDate(initMonthRef.current, initDateRef.current);
  }, []);

  return (
    <>
      <Wrapper>
        <div className="date-picker-section">
          <DatePicker
            initMonth={initMonthRef.current}
            initDate={initDateRef.current}
            handleDate={handleDate}
          />
        </div>
        <div className="song-display-section">
          <SongListDisplayer
            dateString={dateString}
            songList={songList}
            handleSong={handleSong}
          />
        </div>
        <div className="song-info-section">
          {currentSong ? (
            <SongTable song={currentSong} />
          ) : (
            <p>곡을 선택해주세요.</p>
          )}
        </div>
      </Wrapper>
    </>
  );
}

export default App;
