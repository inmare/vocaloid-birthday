import { SvgSizeX, SvgSizeY } from "@/constants/svgConfig";
import { Vec2 } from "@components/utils";

export default function SvgGuideline({
  visible = true,
}: {
  visible?: boolean;
}) {
  const lineColor = "#cccccc";
  const padding = 3;
  const strokeWidth = 0.2;

  return (
    <rect
      width={SvgSizeX - padding * 2}
      height={SvgSizeY - padding * 2}
      transform={Vec2.toStyle([new Vec2(padding, padding)])}
      fill="transparent"
      stroke={lineColor}
      strokeWidth={strokeWidth}
      visibility={visible ? "visible" : "hidden"}
    />
  );
}
