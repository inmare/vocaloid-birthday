import { Vec2 } from "@/components/utils";
import {
  SvgCaptionFont,
  SvgSerifFont,
  SvgSizeX,
  SvgSizeY,
} from "@/constants/svgConfig";

export default function SvgFooter({
  accentColor,
  lyrics,
  titleKor,
  composerKor,
}: {
  accentColor: string;
  lyrics: string;
  titleKor: string;
  composerKor: string;
}) {
  const footerHeight = 23;

  const rectPos = new Vec2(0, SvgSizeY - footerHeight);
  const textPos = new Vec2(SvgSizeX / 2, SvgSizeY - 13);

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
          <tspan>{lyrics}</tspan>
        </text>
        <text
          textAnchor="middle"
          fontFamily={SvgCaptionFont}
          fill="#ffffff"
          fontSize={2.5}
          dy={lyricsFontSize}
        >
          <tspan>{`${titleKor}, ${composerKor}`}</tspan>
        </text>
      </g>
    </>
  );
}
