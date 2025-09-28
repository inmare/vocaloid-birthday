import { useState, useEffect } from "react";
import clsx from "clsx";
import "@scss/App.scss";

function App() {
  useEffect(() => {
    // temp
  }, []);

  const [month, setMonth] = useState<number | null>(null);
  const [date, setDate] = useState<number | null>(null);

  const monthNumber = Array.from({ length: 12 }, (_, i) => i + 1);

  const [isPickingDate, setIsPickingDate] = useState(!false);

  const handleMonth = () => {
    setIsPickingDate(!isPickingDate);
  };

  return (
    <>
      <div className="wrapper">
        <div className="date-picker-wrapper">
          <button onClick={handleMonth}>날짜 선택</button>
          <div
            className={clsx("picker-wrapper", {
              hide: isPickingDate,
            })}
          >
            <div className="picker month">
              {monthNumber.map((value) => {
                return <p>{value}월</p>;
              })}
            </div>
            <div className="picker date"></div>
            <button>선택</button>
          </div>
        </div>
        <div className="song-display-wrapper">곡 리스트</div>
        <div className="song-info-wrapper">곡 정보</div>
      </div>
    </>
  );
}

export default App;
