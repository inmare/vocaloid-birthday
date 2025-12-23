import SvgDefault from "@/constants/svgDefaults";
import {
  DateText,
  Footer,
  Guideline,
  QrCode,
  Thumbnail,
  Title,
} from "@components/svg";
import clsx from "clsx";

export default function MainSvg({
  month,
  date,
  className,
  mode,
  svgRef,
}: {
  month: number;
  date: number;
  className?: string;
  mode?: "dev" | "prod";
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const { sizeX, sizeY } = SvgDefault;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${sizeX} ${sizeY}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width={mode === "dev" ? `${SvgDefault.sizeX}mm` : ""}
      height={mode === "dev" ? `${SvgDefault.sizeY}mm` : ""}
      className={clsx("drop-shadow-[0_0_4px] drop-shadow-zinc-600", className)}
    >
      <rect width={sizeX} height={sizeY} fill="#ffffff" />
      <DateText {...{ month, date }} />
      <QrCode {...{ month, date }} />
      <Thumbnail />
      <Title />
      <Footer />
      <Guideline />
    </svg>
  );
}
