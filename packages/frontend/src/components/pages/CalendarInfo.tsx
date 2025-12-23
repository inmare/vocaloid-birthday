import YearContent from "@/markdown/2026.md?raw";
import clsx from "clsx";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { NavLink, useLoaderData } from "react-router";

dayjs.extend(localeData);

const weekdays = dayjs.weekdaysShort();

function calculateCurrentMonth() {
  const now = dayjs();
  const year = now.year();
  if (year == 2026) {
    return now.month() + 1;
  } else {
    return 1;
  }
}

export default function CalendarInfo() {
  const { year } = useLoaderData() as {
    year: number;
  };
  const [currentMonth, setCurrentMonth] = useState(calculateCurrentMonth());
  const firstDay = dayjs(`2026-${currentMonth}-1`);
  const daysInMonth = firstDay.daysInMonth();
  const startDay = firstDay.day();
  const totalCells = 7 * 5;

  const dates = Array.from({ length: totalCells }, (_, i) => {
    const day = i - startDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const lastDate = dates[dates.length - 1];
  if (lastDate !== null && lastDate !== daysInMonth) {
    for (let i = 0; i < daysInMonth - lastDate; i++) {
      dates[i] = lastDate + i + 1;
    }
  }

  const weeks = Array.from({ length: dates.length / 7 }, (_, i) => {
    return dates.slice(i * 7, (i + 1) * 7);
  });

  useEffect(() => {
    document.title = `${year}년의 달력`;
  }, []);

  const svgWidth = 400;
  const svgHeight = 300;
  const calendarOffset = 20;
  const calendarWidth = svgWidth;
  const calendarHeight = svgHeight - calendarOffset;
  const topHeight = 40;
  const ringOffset = 38;
  const ringGap = 52;

  const animationClass = [
    "transition-all duration-100 ease-in-out select-none",
    "scale-104 border-[#92989a] border-r-2 border-b-2",
    "hover:scale-100 hover:border-none",
    "active:scale-100 active:border-none",
  ].join(" ");

  const markdownClass =
    "prose prose-zinc prose-invert prose-a:text-cyan-600 prose-h1:mb-2 prose-p:mt-1 mx-auto max-w-4xl p-10";

  const handleMonth = (mode: "up" | "down") => {
    if (mode === "up") {
      if (currentMonth === 12) setCurrentMonth(1);
      else setCurrentMonth(currentMonth + 1);
    } else {
      if (currentMonth === 1) setCurrentMonth(12);
      else setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <>
      <h1 className="m-5 text-center text-2xl font-extrabold md:text-4xl">
        2026년 보컬로이드 달력
      </h1>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="m-auto max-w-4xl px-10"
      >
        <defs>
          <clipPath id="calendar-clip-path">
            <rect
              y={calendarOffset}
              width={calendarWidth}
              height={calendarHeight}
              rx={15}
              fill={"#ffffff"}
            ></rect>
          </clipPath>
        </defs>

        <g clipPath="url(#calendar-clip-path)">
          <rect
            width={calendarWidth}
            height={calendarHeight - topHeight}
            fill={"#e4e8eb"}
            y={calendarOffset + topHeight}
          />
          <rect
            width={calendarWidth}
            height={topHeight}
            fill={"#cd3742"}
            y={calendarOffset}
          />
        </g>
        {Array.from({ length: 7 }, (_, i) => (
          <g>
            <rect
              width={24}
              height={18}
              x={ringOffset - 7 + i * ringGap}
              y={32}
              rx={5}
              fill={"#a02838"}
            />
            <rect
              width={10}
              height={45}
              x={ringOffset + i * ringGap}
              rx={5}
              fill={"#262535"}
            />
          </g>
        ))}

        <foreignObject
          x={0}
          y={calendarOffset + topHeight}
          width={calendarWidth}
          height={calendarHeight - topHeight}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="grid w-[90%] grid-cols-7 gap-1">
              {weekdays.map((weekday, index) => (
                <div
                  className={clsx(
                    "flex aspect-4/1 items-center justify-center font-bold text-[#000000]",
                    {
                      "text-[#c22828]": index === 0,
                      "text-[#1567b4]": index === 6,
                    },
                  )}
                  key={index}
                >
                  {weekday}
                </div>
              ))}
              {weeks.map((week, weekIndex) => (
                <>
                  {week.map((day, dayIndex) => (
                    <div
                      className={clsx(
                        "aspect-4/3 rounded-lg bg-[#c3cbce] text-center font-[Paperlogy] text-xl font-bold",
                        day !== null && animationClass + " cursor-pointer",
                        day === null && "opacity-70",
                      )}
                      key={weekIndex * 7 + dayIndex}
                    >
                      {day !== null && (
                        <NavLink
                          className="flex h-full w-full items-center justify-center"
                          to={`${currentMonth}/${day}`}
                        >
                          {day}
                        </NavLink>
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </foreignObject>
      </svg>
      <div className="flex w-full justify-center pt-5">
        <button className="cursor-pointer" onClick={() => handleMonth("down")}>
          <ChevronLeft size={30} />
        </button>
        <p className="text-xl font-bold md:text-3xl">{currentMonth}월</p>
        <button className="cursor-pointer" onClick={() => handleMonth("up")}>
          <ChevronRight size={30} />
        </button>
      </div>

      <div className={markdownClass}>
        <ReactMarkdown>{YearContent}</ReactMarkdown>
      </div>
    </>
  );
}
