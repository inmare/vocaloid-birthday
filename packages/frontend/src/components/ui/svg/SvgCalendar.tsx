import SvgDefault from "@/constants/svgConfig";
import SvgDateText from "@components/ui/svg/SvgDateText";
import SvgFooter from "@components/ui/svg/SvgFooter";
import SvgGuideline from "@components/ui/svg/SvgGuideline";
import SvgQrCode from "@components/ui/svg/SvgQrCode";
import SvgThumbnail from "@components/ui/svg/SvgThumbnail";
import SvgTitle from "@components/ui/svg/SvgTitle";

export default function SvgCalendar({
  month,
  date,
  svgRef,
}: {
  month: number;
  date: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const { sizeX, sizeY } = SvgDefault;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${sizeX} ${sizeY}`}
      xmlns="http://www.w3.org/2000/svg"
      width={`${SvgDefault.sizeX}mm`}
      height={`${SvgDefault.sizeY}mm`}
      className="shadow-[0_0_10px] shadow-zinc-400"
    >
      <rect width={sizeX} height={sizeY} fill="#ffffff" />
      <SvgDateText {...{ month, date }} />
      <SvgQrCode {...{ month, date }} />
      <SvgThumbnail />
      <SvgTitle />
      <SvgFooter />
      <SvgGuideline visible={true} />
    </svg>
  );
}
