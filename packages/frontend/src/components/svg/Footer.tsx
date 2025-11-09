import SvgDefault from "@/constants/svgDefaults";
import { SvgContext } from "@components/SvgContext";
import { Vec2 } from "@components/utils";
import { useContext, useMemo } from "react";

export default function Footer() {
  const footerHeight = 23;

  const rectPos = new Vec2(0, SvgDefault.sizeY - footerHeight);
  const textPos = new Vec2(SvgDefault.sizeX / 2, SvgDefault.sizeY - 13);

  const lyricsFontSize = 3.5;

  const { fragment } = useContext(SvgContext);
  const captionText = useMemo(() => {
    return `${fragment.titleKor}, ${fragment.composerKor}`;
  }, [fragment.titleKor, fragment.composerKor]);

  return (
    <>
      <rect
        width={SvgDefault.sizeX}
        height={footerHeight}
        transform={`${Vec2.toStyle([rectPos])}`}
        fill={fragment.accentColor}
      />
      <g transform={`${Vec2.toStyle([textPos])}`}>
        <text
          textAnchor="middle"
          fontFamily={SvgDefault.serifFont}
          fill="#ffffff"
          fontSize={lyricsFontSize}
        >
          <tspan>{fragment.lyrics}</tspan>
        </text>
        <text
          textAnchor="middle"
          fontFamily={SvgDefault.captionFont}
          fill="#ffffff"
          fontSize={2.5}
          dy={lyricsFontSize}
        >
          <tspan>{captionText}</tspan>
        </text>
      </g>
    </>
  );
}
