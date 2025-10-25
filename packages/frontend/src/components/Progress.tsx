import { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import SongListDisplayer from "./SongListDisplayer";
import SvgViewer from "./SvgViewer";
import type { SongWithPVs } from "@vocaloid-birthday/common";
import api from "../api";
import { useAuth } from "./AuthContext";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export default function Progress() {
  const { accessToken } = useAuth();
  const isAdmin = !!accessToken;

  const [month, setMonth] = useState<number>(1);
  const [date, setDate] = useState<number>(1);
  const [dateArray, setDateArray] = useState<(number | null)[]>([]);

  const [currentSong, setCurrentSong] = useState<SongWithPVs | null>(null);
  const [songList, setSongList] = useState<SongWithPVs[]>([]);

  const [dateString, setDateString] = useState<string>("");

  useEffect(() => {
    document.title = "Progress";
    updateMonthArray(1);
  }, []);

  useEffect(() => {
    const getSongData = async () => {
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

    handleDateString(month, date);
    getSongData();
  }, [month, date]);

  const handleDateString = (month: number, date: number) => {
    const currentDate = dayjs("2026")
      .set("month", month - 1)
      .set("date", date);
    const dateString = currentDate.format("M월 D일");
    setDateString(dateString);
  };

  const updateMonthArray = (month: number) => {
    const month2026 = dayjs("2026").set("month", month - 1);
    const daysInMonth = month2026.daysInMonth();
    const dateArray: (number | null)[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dateArray.push(i);
    }
    const startDay = month2026.startOf("month").day();
    for (let i = 0; i < startDay; i++) {
      dateArray.unshift(null);
    }
    while (dateArray.length % 7 !== 0) {
      dateArray.push(null);
    }
    setDateArray(dateArray);
  };

  const handleDate = (direction: "back" | "forth") => {
    let newMonth = month;
    if (direction === "back") {
      newMonth = Math.max(1, month - 1);
    } else if (direction === "forth") {
      newMonth = Math.min(12, month + 1);
    }

    setMonth(newMonth);
    updateMonthArray(newMonth);
  };

  const handleClickDate = (date: number | null) => {
    if (date === null) return;
    setDate(date);
  };

  const handleSong = (song: SongWithPVs) => {
    setCurrentSong(song);
  };

  return (
    <>
      <Wrapper>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => {
              handleDate("back");
            }}
          >
            {"<"}
          </button>
          <p style={{ display: "inline-block" }}>{month}월</p>
          <button
            onClick={() => {
              handleDate("forth");
            }}
          >
            {">"}
          </button>
        </div>
        <Calendar>
          {dateArray.map((value, index) => {
            return (
              <button key={index} onClick={() => handleClickDate(value)}>
                {value !== null ? value : ""}
              </button>
            );
          })}
        </Calendar>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            height: "100%",
          }}
        >
          <div>
            <SongListDisplayer
              dateString={dateString}
              currentSong={currentSong}
              songList={songList}
              handleSong={handleSong}
            />
          </div>
          <div>
            <SvgViewer song={currentSong} isAdmin={isAdmin} />
          </div>
        </div>
      </Wrapper>
    </>
  );
}
