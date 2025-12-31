import api from "@/api";
import { DEV_API_ENDPOINT } from "@/constants";
import NNLogo from "@assets/niconico.svg";
import YTLogo from "@assets/youtube.svg";
import type { CalendarWithSong } from "@vocaloid-birthday/common";
import clsx from "clsx";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { MainSvg } from "../svg";
import { SvgContext } from "../SvgContext";
import { SvgProvider } from "../SvgProvider";
import type { SvgConfig } from "../type";

type PvInfo = {
  pvId: string;
  service: string;
};

function CalendarCompoenent({
  year,
  month,
  date,
}: {
  year: number;
  month: number;
  date: number;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { updateTitle, updateComposer, updateFragment } =
    useContext(SvgContext);

  const [prevDate, setPrevDate] = useState<string | null>(null);
  const [nextDate, setNextDate] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [composer, setComposer] = useState<string>("");
  const [pvInfo, setPvInfo] = useState<PvInfo[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        const response = await api.get("/api/calendar", {
          params: { month, date },
        });
        const data = response.data as CalendarWithSong;

        const svgConfig = data.svgConfig as SvgConfig;
        updateTitle(svgConfig.title);
        updateComposer(svgConfig.composer);
        const fragment = svgConfig.fragment;
        fragment.imageLink = data.imageFileName
          ? `${DEV_API_ENDPOINT}/static/${data.imageFileName}`
          : null;
        updateFragment(fragment);

        console.log(data);

        setTitle(data?.titleKor ?? "");
        setComposer(data?.composerKor ?? "");

        const pvs = data.Song.PVs;
        const infoArray = [];
        for (const pv of pvs) {
          // 일단 bilibili는 api가 필요해서 패스
          if (pv.service === "Bilibili") continue;
          infoArray.push({ pvId: pv.pvId, service: pv.service });
        }
        setPvInfo(infoArray);
      } catch (error) {
        console.error(error);
      }
    };

    getCalendarData();

    const prev = dayjs(`${year}-${month}-${date - 1}`);
    if (prev.get("year") === year) {
      setPrevDate(prev.format("/YYYY/M/D"));
    }
    const next = dayjs(`${year}-${month}-${date + 1}`);
    if (next.get("year") === year) {
      setNextDate(next.format("/YYYY/M/D"));
    }
  }, [year, month, date]);

  return (
    <>
      <MainSvg
        svgRef={svgRef}
        month={month}
        date={date}
        className="mx-4 w-[90%] max-w-120 py-5"
      />

      <div className="flex justify-center py-2">
        <button
          onClick={() => prevDate && navigate(prevDate)}
          className={clsx({
            "opacity-70": prevDate === null,
          })}
        >
          <ChevronLeft size={30} />
        </button>
        <h1 className="text-center text-3xl font-bold">{`${year}년 ${month}월 ${date}일`}</h1>
        <button
          onClick={() => nextDate && navigate(nextDate)}
          className={clsx({
            "opacity-70": nextDate === null,
          })}
        >
          <ChevronRight size={30} />
        </button>
      </div>
      <div className="text-center">
        <p className="px-10 text-2xl font-bold whitespace-pre-wrap lg:text-3xl">
          {title}
        </p>
        <p className="text-lg font-normal whitespace-pre-wrap lg:text-xl">
          {composer}
        </p>
        <table className="mx-auto my-3">
          <tr>
            {pvInfo.map((value, index) => {
              let link;
              let imgSrc;
              if (value.service === "NicoNicoDouga") {
                link = `https://nico.ms/${value.pvId}`;
                imgSrc = NNLogo;
              } else {
                link = `https://youtu.be/${value.pvId}`;
                imgSrc = YTLogo;
              }
              return (
                <td key={index}>
                  <div className="flex items-center justify-center px-2">
                    <a href={link} target="_blank">
                      <img
                        src={imgSrc}
                        className="my-auto h-10 w-10 object-contain"
                      />
                    </a>
                  </div>
                </td>
              );
            })}
          </tr>
        </table>
      </div>
    </>
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
        <div className="flex flex-col items-center justify-center">
          <CalendarCompoenent year={year} month={month} date={date} />
        </div>
      </SvgProvider>
    </>
  );
}
