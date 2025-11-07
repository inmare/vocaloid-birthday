import { SvgSizeX } from "@/constants/svgConfig";
import { SvgContext } from "@components/SvgContext";
import type { TextItem } from "@components/type";
import { Vec2 } from "@components/utils";
import { useContext, useEffect, useRef, useState } from "react";

export default function Title() {
  const { title, composer } = useContext(SvgContext);

  const groupRef = useRef<SVGGElement | null>(null);
  const [groupPos, setGroupPos] = useState<[number, number]>([
    SvgSizeX / 2,
    100,
  ]);

  useEffect(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const bbox = g.getBBox();
    const x = SvgSizeX / 2;
    const y = 117 - bbox.height / 2;
    setGroupPos([x, y]);
  }, [title, composer, setGroupPos]);

  const composerFontSize = 6;
  const titleFontSize = 8;

  const createTextItems = (line: TextItem[]) => {
    return line.map((item) => {
      return (
        <tspan
          dx={item.typo.offsetX}
          dy={item.typo.offsetY}
          key={item.id}
          letterSpacing={`${item.typo.leading}em`}
        >
          {item.text.replaceAll(" ", "\u00a0")}
        </tspan>
      );
    });
  };

  const createTextLines = (itemMatrix: TextItem[][], fontSize: number) => {
    return itemMatrix.map((line, index) => {
      return (
        <text key={index} y={index * fontSize}>
          {createTextItems(line)}
        </text>
      );
    });
  };

  return (
    <g
      ref={groupRef}
      textAnchor="middle"
      transform={`${Vec2.toStyle([new Vec2(...groupPos)])}`}
    >
      <g fontSize={composerFontSize} fontWeight={300}>
        {createTextLines(composer.items, composerFontSize)}
      </g>
      <g
        fontSize={titleFontSize}
        transform={`translate(0, ${composerFontSize * composer.items.length + 2})`}
        fontWeight={700}
      >
        {createTextLines(title.items, titleFontSize)}
      </g>
    </g>
  );
}
