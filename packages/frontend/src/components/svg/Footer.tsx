import SvgDefault from "@/constants/svgDefaults";
import { SvgContext } from "@components/SvgContext";
import { Vec2 } from "@components/utils";
import { useContext, useLayoutEffect, useMemo, useRef, useState } from "react";

export default function Footer() {
  const footerHeight = 24;
  const groupY = 146;

  const rectPos = new Vec2(0, SvgDefault.sizeY - footerHeight);
  const [textPos, setTextPos] = useState<[number, number]>([
    SvgDefault.sizeX / 2,
    groupY,
  ]);

  const lyricsFontSize = 3.5;
  const lyricsLineSpacing = 1.3;

  const { fragment } = useContext(SvgContext);

  const textGroupRef = useRef<SVGGElement | null>(null);

  useLayoutEffect(() => {
    if (!textGroupRef.current) return;
    const g = textGroupRef.current;
    const bbox = g.getBBox();
    const y = groupY - bbox.height / 2;
    setTextPos([SvgDefault.sizeX / 2, y]);
  }, [fragment.lyrics]);

  const captionText = useMemo(() => {
    return `${fragment.titleKor}, ${fragment.composerKor}`;
  }, [fragment.titleKor, fragment.composerKor]);

  const lyricsLines = useMemo(() => {
    return fragment.lyrics.split("\n");
  }, [fragment.lyrics]);

  const lyricsLinesLength = useMemo(() => {
    return lyricsLines.length;
  }, [lyricsLines]);

  return (
    <>
      <rect
        width={SvgDefault.sizeX}
        height={footerHeight}
        transform={`${Vec2.toStyle([rectPos])}`}
        fill={fragment.accentColor}
      />
      <g
        ref={textGroupRef}
        transform={`${Vec2.toStyle([new Vec2(...textPos)])}`}
      >
        <g
          textAnchor="middle"
          fontFamily={SvgDefault.serifFont}
          fill="#ffffff"
          fontSize={lyricsFontSize}
        >
          {fragment.lyrics.split("\n").map((line, index) => {
            return (
              <text key={index} y={index * lyricsFontSize * lyricsLineSpacing}>
                {line}
              </text>
            );
          })}
        </g>
        <text
          textAnchor="middle"
          fontFamily={SvgDefault.captionFont}
          fill="#ffffff"
          fontSize={2.5}
          dy={lyricsFontSize * lyricsLinesLength * lyricsLineSpacing}
        >
          <tspan>{captionText}</tspan>
        </text>
      </g>
    </>
  );
}
