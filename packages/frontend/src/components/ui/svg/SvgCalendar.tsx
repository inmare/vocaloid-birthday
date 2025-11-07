import Guideline from "@/components/ui/svg/SvgGuideline";
import { SvgSizeX, SvgSizeY } from "@/constants/svgConfig";
import Thumbnail from "@components/ui/svg/SvgThumbnail";
import { useRef } from "react";
import DateText from "./SvgDateText";
import Footer from "./SvgFooter";
import QrCode from "./SvgQrCode";
import Title from "./SvgTitle";

export default function SvgCalendar({
  month,
  date,
  accentColor,
}: {
  month: number;
  date: number;
  accentColor: string;
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
      <DateText {...{ month, date, accentColor }} />
      <QrCode {...{ month, date }} />
      <Thumbnail />
      <Title />
      <Footer accentColor={accentColor} />
      <Guideline visible={true} />
    </svg>
  );
}
