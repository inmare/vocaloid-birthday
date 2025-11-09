import SvgDefault from "@/constants/svgDefaults";
import { SvgContext } from "@components/SvgContext";
import type { TextItem } from "@components/type";
import { Vec2 } from "@components/utils";
import { useContext, useLayoutEffect, useRef, useState } from "react";

export default function Title() {
  const { title, composer } = useContext(SvgContext);

  const defaultX = SvgDefault.sizeX / 2;
  const defaultY = 117.5;
  const groupRef = useRef<SVGGElement | null>(null);

  const [groupPos, setGroupPos] = useState<[number, number]>([
    defaultX,
    defaultY,
  ]);

  useLayoutEffect(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const bbox = g.getBBox();
    const y = defaultY - bbox.height / 2;
    setGroupPos([defaultX, y]);
  }, [title, composer, defaultX, defaultY]);

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

  const createTextLines = (
    itemMatrix: TextItem[][],
    fontSize: number,
    lineHeight: number,
  ) => {
    return itemMatrix.map((line, index) => {
      return (
        <text key={index} y={index * fontSize * lineHeight}>
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
      <g fontSize={composer.fontSize} fontWeight={300}>
        {createTextLines(
          composer.items,
          composer.fontSize,
          composer.lineHeight,
        )}
      </g>
      <g
        fontSize={title.fontSize}
        transform={`translate(0, ${composer.fontSize * composer.lineHeight * composer.items.length + 3})`}
        fontWeight={700}
      >
        {createTextLines(title.items, title.fontSize, title.lineHeight)}
      </g>
    </g>
  );
}
