import type { ImageConfig } from "@/components/type";
import SvgGuideline from "@/components/ui/svg/SvgGuideline";
import { SvgSizeX, SvgSizeY } from "@/constants/svgConfig";
import SvgThumbnail from "@components/ui/svg/SvgThumbnail";
import { useRef } from "react";
import SvgDateText from "./SvgDateText";
import SvgFooter from "./SvgFooter";
import SvgQrCode from "./SvgQrCode";
import Title from "./SvgTitle";

export default function SvgCalendar({
  month,
  date,
  accentColor,
  lyrics,
  titleKor,
  composerKor,
  imageBase64,
  imagePos,
}: {
  month: number;
  date: number;
  accentColor: string;
  lyrics: string;
  titleKor: string;
  composerKor: string;
  imageBase64: string | null;
  imagePos: ImageConfig;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SvgSizeX} ${SvgSizeY}`}
      xmlns="http://www.w3.org/2000/svg"
      width={`${SvgSizeX}mm`}
      height={`${SvgSizeY}mm`}
      className="shadow-[0_0_10px] shadow-zinc-400"
    >
      <rect width={SvgSizeX} height={SvgSizeY} fill="#ffffff" />
      <SvgDateText {...{ month, date, accentColor }} />
      <SvgQrCode {...{ month, date }} />
      <SvgThumbnail {...{ imageBase64, imagePos }} />
      <Title />
      <SvgFooter {...{ accentColor, lyrics, titleKor, composerKor }} />
      <SvgGuideline visible={true} />
    </svg>
  );
}
