import { Vec2 } from "@components/utils";

export default function Guideline({
  visible = true,
  factor,
  svgSize,
}: {
  visible?: boolean;
  factor: number;
  svgSize: Vec2;
}) {
  const lineColor = "#cccccc";
  const padding = 3 * factor;
  return (
    <>
      <g visibility={visible ? "visible" : "hidden"}>
        <line
          strokeWidth={2}
          stroke={lineColor}
          x1={0}
          y1={padding}
          x2={svgSize.x}
          y2={padding}
        ></line>
        <line
          strokeWidth={2}
          stroke={lineColor}
          x1={0}
          y1={svgSize.y - padding}
          x2={svgSize.x}
          y2={svgSize.y - padding}
        ></line>
        <line
          strokeWidth={2}
          stroke={lineColor}
          x1={padding}
          y1={0}
          x2={padding}
          y2={svgSize.y}
        ></line>
        <line
          strokeWidth={2}
          stroke={lineColor}
          x1={svgSize.x - padding}
          y1={0}
          x2={svgSize.x - padding}
          y2={svgSize.y}
        ></line>
      </g>
    </>
  );
}
