import SvgDateText from "@/components/svg/SvgDateText";
import SvgFooter from "@/components/svg/SvgFooter";
import SvgGuideline from "@/components/svg/SvgGuideline";
import SvgQrCode from "@/components/svg/SvgQrCode";
import SvgThumbnail from "@/components/svg/SvgThumbnail";
import SvgTitle from "@/components/svg/SvgTitle";
import SvgDefault from "@/constants/svgDefaults";

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
