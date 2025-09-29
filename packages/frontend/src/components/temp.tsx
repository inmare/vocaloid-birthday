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
</div>;
