import api from "@/api";
import { DEV_API_ENDPOINT } from "@/constants";
import type { CalendarAttributes } from "@vocaloid-birthday/common";
import { useContext, useEffect, useRef } from "react";
import { useLoaderData } from "react-router";
import { MainSvg } from "../svg";
import { SvgContext } from "../SvgContext";
import { SvgProvider } from "../SvgProvider";
import type { SvgConfig } from "../type";

function CalendarCompoenent({ month, date }: { month: number; date: number }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { updateTitle, updateComposer, updateFragment } =
    useContext(SvgContext);

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        const response = await api.get("/api/calendar", {
          params: { month, date },
        });
        const data = response.data as CalendarAttributes;

        const svgConfig = data.svgConfig as SvgConfig;
        updateTitle(svgConfig.title);
        updateComposer(svgConfig.composer);
        const fragment = svgConfig.fragment;
        fragment.imageLink = data.imageFileName
          ? `${DEV_API_ENDPOINT}/static/${data.imageFileName}`
          : null;
        updateFragment(fragment);
      } catch (error) {
        console.error(error);
      }
    };

    getCalendarData();
  }, []);

  return (
    <MainSvg
      svgRef={svgRef}
      month={month}
      date={date}
      className="mx-4 w-[90%] max-w-120"
    />
  );
}

export default function MainCalendar() {
  const { year, month, date } = useLoaderData() as {
    year: number;
    month: number;
    date: number;
  };

  return (
    <>
      <SvgProvider>
        <h1 className="my-3 text-center text-3xl font-bold">{`${year}년 ${month}월 ${date}일`}</h1>
        <div className="flex justify-center">
          <CalendarCompoenent month={month} date={date} />
        </div>
      </SvgProvider>
    </>
  );
}
