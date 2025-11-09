import type { DateData } from "@/components/type";
import clsx from "clsx";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ButtonHTMLAttributes } from "react";

type MoveMode = "left" | "right";

interface MonthMoveBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: MoveMode;
}

function MonthMoveBtn({ mode, className, ...rest }: MonthMoveBtnProps) {
  return (
    <button
      {...rest}
      className={clsx("aspect-square rounded-lg bg-cyan-900 p-1", className)}
    >
      {mode === "left" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

export default function ProgressCalendar({
  month,
  date,
  dateArray,
  setMonth,
  setDate,
  setCurrentSong,
}: {
  month: number;
  date: number;
  dateArray: DateData[];
  setMonth: (month: number) => void;
  setDate: (date: number) => void;
  setCurrentSong: (data: null) => void;
}) {
  const handleMonth = (moveMode: MoveMode) => {
    let newMonth = month;
    if (moveMode === "left") {
      if (month === 1) newMonth = 12;
      else newMonth -= 1;
    } else if (moveMode === "right") {
      if (month === 12) newMonth = 1;
      else newMonth += 1;
    }
    setMonth(newMonth);

    // 날짜가 바뀐 달의 일 수보다 크면 맞춰줌
    const daysInMonth = dayjs("2026")
      .set("month", newMonth - 1)
      .daysInMonth();
    if (date > daysInMonth) {
      setDate(daysInMonth);
    }

    // 달이 바뀌면 새로운 노래를 리셋함
    setCurrentSong(null);
  };

  const progressClass = {
    finished: "bg-green-900",
    unfinished: "bg-red-900",
    noValue: "bg-gray-700",
  };

  const getProgressClass = (data: DateData) => {
    if (data.value === null) return progressClass.noValue;
    return data.finished ? progressClass.finished : progressClass.unfinished;
  };

  return (
    <>
      <div className="m-auto max-w-80">
        <div className="flex flex-row content-center justify-center">
          <MonthMoveBtn mode="left" onClick={() => handleMonth("left")} />
          <p className="m-auto mx-3 text-2xl font-bold">{month}월</p>
          <MonthMoveBtn mode="right" onClick={() => handleMonth("right")} />
        </div>
        <div className="m-3 grid grid-cols-7 gap-0.5 rounded-xl bg-zinc-800 p-2">
          {dateArray.map((value, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  if (value.value === null) return;
                  setDate(value.value);
                  setCurrentSong(null);
                }}
                className={clsx(
                  "font-monospace rounded-lg p-1",
                  getProgressClass(value),
                )}
              >
                {value.value !== null ? value.value : ""}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
