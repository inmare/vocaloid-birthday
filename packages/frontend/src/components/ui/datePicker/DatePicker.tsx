import type { DateSelectMode, VisibilityState } from "@components/type";
import DateGrid from "@components/ui/datePicker/DateGrid";
import ModeSelectBtn from "@components/ui/datePicker/ModeSelectBtn";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import CalendarIcon from "@assets/calendar.svg";

export default function DatePicker({
  setMonth,
  setDate,
}: {
  setMonth: (month: number) => void;
  setDate: (date: number) => void;
}) {
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<DateSelectMode>("month");

  const calendarClasses = {
    show: "opacity-100 translate-y-0",
    hide: "opacity-0 -translate-y-1 pointer-events-none",
  };

  const [visibility, setVisibility] = useState<VisibilityState>("hide");

  const handleVisible = () => {
    if (visibility === "show") setVisibility("hide");
    else if (visibility === "hide") {
      setMode("month");
      setVisibility("show");
    }
  };

  useEffect(() => {
    const detectClick = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;

      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setVisibility("hide");
      }
    };

    if (visibility === "show") {
      window.addEventListener("click", detectClick);
    }

    return () => {
      window.removeEventListener("click", detectClick);
    };
  }, [visibility, pickerRef]);

  return (
    <>
      <div className="flex justify-center">
        <div ref={pickerRef} className="relative flex flex-col items-center">
          <button
            className="group m-2 w-20 cursor-pointer"
            onClick={handleVisible}
          >
            <img
              src={CalendarIcon}
              alt="검색"
              className="transition duration-150 ease-in-out group-hover:drop-shadow-[0_0_10px] group-hover:drop-shadow-zinc-700"
            />
          </button>
          <p className="text-center text-xs">
            아이콘을 클릭해
            <br /> 날짜를 선택하세요
          </p>
          <div
            className={clsx(
              "absolute top-24 w-3xs transform rounded-2xl border border-zinc-600 bg-zinc-800 p-4 transition duration-250 ease-in-out",
              {
                [calendarClasses.show]: visibility === "show",
                [calendarClasses.hide]: visibility === "hide",
              },
            )}
          >
            <div className="flex w-full flex-row justify-center px-1 pb-3">
              <ModeSelectBtn mode={mode} setMode={setMode} />
            </div>
            <DateGrid
              selectMode={mode}
              setSelectMode={setMode}
              setVisible={setVisibility}
              setMonth={setMonth}
              setDate={setDate}
            />
          </div>
        </div>
      </div>
    </>
  );
}
