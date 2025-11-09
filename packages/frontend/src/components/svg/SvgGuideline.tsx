import SvgDefault from "@/constants/svgDefaults";
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
      width={SvgDefault.sizeX - padding * 2}
      height={SvgDefault.sizeY - padding * 2}
      transform={Vec2.toStyle([new Vec2(padding, padding)])}
      fill="transparent"
      stroke={lineColor}
      strokeWidth={strokeWidth}
      visibility={visible ? "visible" : "hidden"}
    />
  );
}
