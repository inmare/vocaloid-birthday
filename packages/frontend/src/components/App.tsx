import { useState, useEffect } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import "@scss/App.scss";

function App() {
  const [month, setMonth] = useState<number>(-1);
  const [date, setDate] = useState<number>(-1);
  const [maxDate, setMaxDate] = useState<number>(-1);
  const [dateString, setDateString] = useState<string>();

  useEffect(() => {
    const current = dayjs();
    setMonth(current.month() + 1);
    setDate(current.date());
    setMaxDate(current.daysInMonth());
  }, []);

  useEffect(() => {
    const monthString = String(month);
    const dateString = date === 0 ? "전체" : String(date) + "일";
    const str = `${monthString}월 ${dateString}의 곡`;
    setDateString(str);
  }, [month, date]);

  const [selectMode, setSelectMode] = useState<"month" | "date">("month");

  const monthNumber = Array.from({ length: 12 }, (_, i) => i + 1);
  const dateNumber = Array.from({ length: 31 }, (_, i) => i + 1);

  const [isPickingDate, setIsPickingDate] = useState(!false);

  const handlePickingType = () => {
    setIsPickingDate(!isPickingDate);
  };

  const handleMonthClick = (value: number) => {
    setMonth(value);
    const maxDate = dayjs()
      .set("month", value - 1)
      .daysInMonth();
    setMaxDate(maxDate);
    if (date > maxDate) {
      setDate(maxDate);
    }
  };

  const handleDateClick = (value: number) => {
    if (maxDate === -1 || value > maxDate) {
      return;
    }

    setDate(value);
  };

  return (
    <>
      <div className="wrapper">
        <div className="date-picker-section">
          <div className="date-picker-wrapper">
            <button onClick={handlePickingType}>날짜 선택</button>
            <div
              className={clsx("picker-wrapper", {
                hide: isPickingDate,
              })}
            >
              <div className="picker-type">
                <div
                  className={clsx("button", {
                    active: selectMode === "month",
                  })}
                  onClick={() => setSelectMode("month")}
                >
                  월
                </div>
                <div
                  className={clsx("button", {
                    active: selectMode === "date",
                  })}
                  onClick={() => setSelectMode("date")}
                >
                  일
                </div>
              </div>

              <div
                className={clsx("picker", "month", {
                  hide: selectMode !== "month",
                })}
              >
                {monthNumber.map((value) => {
                  return (
                    <div
                      className={clsx("button", {
                        active: month === value,
                      })}
                      onClick={() => handleMonthClick(value)}
                    >
                      {value}월
                    </div>
                  );
                })}
              </div>
              <div
                className={clsx("picker", "date", {
                  hide: selectMode !== "date",
                })}
              >
                {dateNumber.map((value) => {
                  return (
                    <div
                      className={clsx("button", {
                        active: date === value,
                        deactivate: maxDate !== -1 && value > maxDate,
                      })}
                      onClick={() => handleDateClick(value)}
                    >
                      {value}일
                    </div>
                  );
                })}
                <div
                  className={clsx("button", {
                    active: date === 0,
                  })}
                  onClick={() => handleDateClick(0)}
                >
                  전체
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="song-display-section">
          <p>{dateString}</p>
        </div>
        <div className="song-info-section">곡 정보</div>
      </div>
    </>
  );
}

export default App;
