import { useRef, useState } from "react";
import "@scss/App.scss";
import DatePicker from "./DatePicker";
import dayjs from "dayjs";

function App() {
  const initMonth = dayjs().month() + 1;
  const initDate = dayjs().date();

  const [month, setMonth] = useState<number>(initMonth);
  const [date, setDate] = useState<number>(initDate);
  const initMonthRef = useRef<number>(initMonth);
  const initDateRef = useRef<number>(initDate);

  const dateString = date === 0 ? "전체" : date + "일";
  const pageTitle = `${month}월 ${dateString}의 보카로 곡은?`;
  document.title = pageTitle;

  const handleDate = (month: number, date: number) => {
    setMonth(month);
    setDate(date);
    console.log(
      `Selected date: ${month}월 ${date === 0 ? "전체" : date + "일"}`
    );
  };

  return (
    <>
      <div className="wrapper">
        <div className="date-picker-section">
          <DatePicker
            initMonth={initMonthRef.current}
            initDate={initDateRef.current}
            handleDate={handleDate}
          />
        </div>
        <div className="song-display-section">
          <p>곡 정보</p>
        </div>
        <div className="song-info-section">곡 정보</div>
      </div>
    </>
  );
}

export default App;
