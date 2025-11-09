import DateText from "@/components/svg/DateText";
import Footer from "@/components/svg/Footer";
import Guideline from "@/components/svg/Guideline";
import QrCode from "@/components/svg/QrCode";
import Thumbnail from "@/components/svg/Thumbnail";
import Title from "@/components/svg/Title";
import SvgDefault from "@/constants/svgDefaults";

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
