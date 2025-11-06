import { Vec2 } from "@/components/utils";
import {
  SvgCaptionFont,
  SvgSerifFont,
  SvgSizeX,
  SvgSizeY,
} from "@/constants/svgConfig";

export default function Footer({ accentColor }: { accentColor: string }) {
  const footerHeight = 20;

  const rectPos = new Vec2(0, SvgSizeY - footerHeight);
  const textPos = new Vec2(SvgSizeX / 2, SvgSizeY - 11);

  const lyricsFontSize = 4.5;

  return (
    <>
      <rect
        width={SvgSizeX}
        height={footerHeight}
        transform={`${Vec2.toStyle([rectPos])}`}
        fill={accentColor}
      />
      <g transform={`${Vec2.toStyle([textPos])}`}>
        <text
          textAnchor="middle"
          fontFamily={SvgSerifFont}
          fill="#ffffff"
          fontSize={lyricsFontSize}
        >
          <tspan>아아, 하늘은 이런 색이었구나</tspan>
        </text>
        <text
          textAnchor="middle"
          fontFamily={SvgCaptionFont}
          fill="#ffffff"
          fontSize={2.5}
          dy={lyricsFontSize}
        >
          <tspan>러스트러스, *Luna</tspan>
        </text>
      </g>
    </>
  );
}
