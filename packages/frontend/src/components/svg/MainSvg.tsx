import SvgDefault from "@/constants/svgDefaults";
import {
  DateText,
  Footer,
  Guideline,
  QrCode,
  Thumbnail,
  Title,
} from "@components/svg";

export default function MainSvg({
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
      <DateText {...{ month, date }} />
      <QrCode {...{ month, date }} />
      <Thumbnail />
      <Title />
      <Footer />
      <Guideline visible={true} />
    </svg>
  );
}
