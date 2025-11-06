import { Vec2 } from "@/components/utils";
import { SvgSizeX } from "@/constants/svgConfig";

export default function Title() {
  const titlePos = new Vec2(SvgSizeX / 2, 100);
  const composerFontSize = 6;
  const titleFontSize = 8;

  return (
    <g textAnchor="middle" transform={`${Vec2.toStyle([titlePos])}`}>
      <g fontSize={composerFontSize} fontWeight={300}>
        <text>
          <tspan>TAK</tspan>
        </text>
      </g>
      <g fontSize={titleFontSize} fontWeight={700}>
        <text dy={composerFontSize + 3}>
          <tspan>LEMON MELON COOKIE</tspan>
        </text>
      </g>
    </g>
  );
}
