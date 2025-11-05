import api from "@/api";
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
      className={clsx("aspect-square rounded-lg bg-cyan-900 p-1", className)}
    >
      {mode === "left" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

type DateData = {
  value: number | null;
  finished?: boolean;
};

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
  const [dateArray, setDateArray] = useState<DateData[]>([]);

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
    const fetchProgress = async () => {
      // 한 달의 날짜만큼 미리 날짜를 만들어 둠
      const month2026 = dayjs("2026").set("month", month - 1);
      const daysInMonth = month2026.daysInMonth();
      const dateArray: DateData[] = Array.from(
        {
          length: daysInMonth,
        },
        (_, index) => {
          return { value: index + 1 };
        },
      );

      try {
        const progressRes = await api.get("/api/progress", {
          params: { month },
        });

        const progressData: { progress: boolean[] } = progressRes.data;

        progressData.progress.forEach((finished, index) => {
          if (dateArray[index]) dateArray[index].finished = finished;
        });
      } catch (error) {
        console.error("데이터를 불러오던 중 에러가 발생했습니다:", error);
      }

      // 시작하는 요일 반환
      const startDay = month2026.startOf("month").day();
      // 배열 앞의 빈 부분을 null로 채움
      for (let i = 0; i < startDay; i++) {
        dateArray.unshift({ value: null });
      }
      // 배열 뒤의 빈 부분을 null로 채움
      while (dateArray.length % 7 !== 0) {
        dateArray.push({ value: null });
      }
      setDateArray(dateArray);
    };

    fetchProgress();
  }, [month]);

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
