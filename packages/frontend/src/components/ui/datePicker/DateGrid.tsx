import type { DateSelectMode, VisibilityState } from "@components/type";
import type { ButtonHTMLAttributes } from "react";

const monthList = Array.from({ length: 12 }, (_, index) => index + 1);
const dateList = Array.from({ length: 32 }, (_, index) => index);

function DateButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${className || ""} rounded-full bg-cyan-900 transition duration-100 hover:bg-cyan-600`}
      {...props}
    />
  );
}

export default function DateGrid({
  selectMode,
  setSelectMode,
  setMonth,
  setDate,
  setVisible,
}: {
  selectMode: DateSelectMode;
  setSelectMode: (selectMode: DateSelectMode) => void;
  setMonth: (month: number) => void;
  setDate: (date: number) => void;
  setVisible: (state: VisibilityState) => void;
}) {
  const classList = {
    month: "grid-cols-4 gap-1",
    date: "grid-cols-7 gap-0.5",
  };

  return (
    <>
      <div
        className={`grid ${classList[selectMode]}`}
        onClick={(event) => {
          // 클릭 이벤트를 통해서 요소가 자동으로 닫히는 거 방지용
          // 이 요소는 실제로는 DatePicker 내부에 존재하지 않음
          event.stopPropagation();
        }}
      >
        {selectMode === "month" && (
          <>
            {monthList.map((value) => {
              return (
                <DateButton
                  key={value}
                  onClick={() => {
                    setSelectMode("date");
                    setMonth(value);
                  }}
                  className="font-monospace aspect-square"
                >
                  <span className="m-auto">{value}</span>
                </DateButton>
              );
            })}
          </>
        )}
        {selectMode === "date" && (
          <>
            {dateList.map((value) => {
              return (
                <DateButton
                  key={value}
                  onClick={() => {
                    setDate(value);
                    setVisible("hide");
                  }}
                  className={
                    value === 0
                      ? "col-span-2 aspect-auto"
                      : "font-monospace aspect-square"
                  }
                >
                  <span className="text-sm">
                    {value === 0 ? "전체" : value}
                  </span>
                </DateButton>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
