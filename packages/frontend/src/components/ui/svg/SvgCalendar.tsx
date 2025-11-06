import Guideline from "@/components/ui/svg/SvgGuideline";
import { SvgSizeX, SvgSizeY } from "@/constants/svgConfig";
import Thumbnail from "@components/ui/svg/SvgThumbnail";
import { useRef } from "react";
import DateText from "./SvgDateText";
import Footer from "./SvgFooter";
import Title from "./SvgTitle";

export default function CalendarSvg({
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
      <DateText {...{ month, date }} />
      <Thumbnail />
      <Title />
      <Footer accentColor={accentColor} />
      {/* <g
        dangerouslySetInnerHTML={{
          __html: new QRCode({
            content: "https://example.com",
            padding: 1,
            join: true,
            container: "none",
          }).svg(),
        }}
        transform={`translate(${100}, 100) scale(0.6)`}
      ></g> */}
      <Guideline visible={true} />
    </svg>
  );
}
