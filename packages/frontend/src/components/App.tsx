import { useRef, useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import SongListDisplayer from "./SongListDisplayer";
import SongTable from "./SongTable";
import dayjs from "dayjs";
import { type SongWithPVs } from "@vocaloid-birthday/common";
import styled from "styled-components";
import { NavLink } from "react-router";
import api from "../api";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100dvh;
  max-width: 1200px;
  margin: auto;

  .date-picker-section {
    grid-row: 1 / 2;
  }

  main {
    grid-row: 2 / 3;
    display: grid;
    width: 100%;
    height: 100%;
    min-height: 0;

    .song-display-section {
      grid-column: 1 / 2;
      overflow-y: auto;
      min-height: 0;
    }
  }

  .song-info-section {
    grid-row: 3 / 4;
    overflow-x: auto;
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
`;

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

  const handleDate = async (month: number, date: number) => {
    setMonth(month);
    setDate(date);
    setCurrentSong(null);

    try {
      const response = await api.post("/api/songs", { month, date });
      const json = response.data;

      if (response.status !== 200) {
        throw new Error(
          json.message || "데이터를 불러오던 중 에러가 발생했습니다."
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

  const handleSong = (song: SongWithPVs) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    handleDate(initMonthRef.current, initDateRef.current);
  }, []);

  return (
    <>
      <Wrapper>
        <header className="date-picker-section">
          <div>
            <DatePicker
              initMonth={initMonthRef.current}
              initDate={initDateRef.current}
              handleDate={handleDate}
            />
          </div>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/progress">Progress</NavLink>
        </header>

        <main>
          <div className="song-display-section">
            <SongListDisplayer
              dateString={dateString}
              songList={songList}
              currentSong={currentSong}
              handleSong={handleSong}
            />
          </div>
        </main>

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
