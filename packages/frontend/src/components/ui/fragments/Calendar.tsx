import clsx from "clsx";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes } from "react";

type MoveMode = "left" | "right";

interface MonthMoveBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: MoveMode;
}

function MonthMoveBtn({ mode, className, ...rest }: MonthMoveBtnProps) {
  return (
    <button
      {...rest}
      className={clsx("bg-cyan-900 rounded-lg p-1 aspect-square", className)}
    >
      {mode === "left" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

export default function Calendar({
  month,
  setMonth,
  setDate,
  setCurrentSong,
}: {
  month: number;
  setMonth: (month: number) => void;
  setDate: (date: number) => void;
  setCurrentSong: (data: null) => void;
}) {
  const [dateArray, setDateArray] = useState<(number | null)[]>([]);

  const handleMonth = (moveMode: MoveMode) => {
    const getMonth = (m: number) => {
      return Math.max(Math.min(12, m), 1);
    };

    const newMonth =
      moveMode === "left" ? getMonth(month - 1) : getMonth(month + 1);
    setMonth(newMonth);
    // 달이 바뀌면 새로운 노래를 리셋함
    setCurrentSong(null);
  };

  useEffect(() => {
    // 한 달의 날짜만큼 미리 날짜를 만들어 둠
    const month2026 = dayjs("2026").set("month", month - 1);
    const daysInMonth = month2026.daysInMonth();
    const dateArray: (number | null)[] = Array.from(
      {
        length: daysInMonth,
      },
      (_, index) => index + 1,
    );

    // 시작하는 요일 반환
    const startDay = month2026.startOf("month").day();
    // 배열 앞의 빈 부분을 null로 채움
    for (let i = 0; i < startDay; i++) {
      dateArray.unshift(null);
    }
    // 배열 뒤의 빈 부분을 null로 채움
    while (dateArray.length % 7 !== 0) {
      dateArray.push(null);
    }
    setDateArray(dateArray);
  }, [month]);

  return (
    <>
      <div className="max-w-80 m-auto">
        <div className="flex flex-row justify-center content-center">
          <MonthMoveBtn mode="left" onClick={() => handleMonth("left")} />
          <p className="font-bold text-2xl m-auto mx-3">{month}월</p>
          <MonthMoveBtn mode="right" onClick={() => handleMonth("right")} />
        </div>
        <div className="grid grid-cols-7 bg-zinc-800 m-3 p-2 rounded-xl gap-0.5">
          {dateArray.map((value, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  if (value === null) return;
                  setDate(value);
                  setCurrentSong(null);
                }}
                className="font-monospace bg-cyan-900 p-1 min-h-10 rounded-lg"
              >
                {value !== null ? value : ""}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
