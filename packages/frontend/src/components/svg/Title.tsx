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
  const composerRef = useRef<SVGGElement | null>(null);
  const titleRef = useRef<SVGGElement | null>(null);

  const [groupPos, setGroupPos] = useState<[number, number]>([
    defaultX,
    defaultY,
  ]);

  const [titlePos, setTitlePos] = useState<[number, number]>([
    0,
    composer.fontSize,
  ]);

  useLayoutEffect(() => {
    if (!titleRef.current || !composerRef.current) return;
    // 작곡가의 높이를 구한 다음 제목 그룹의 y 위치를 조정
    const composerGroup = composerRef.current;
    const composerBbox = composerGroup.getBBox();
    const titleGroup = titleRef.current;
    const titleBbox = titleGroup.getBBox();
    const padding = -0.5;
    setTitlePos([
      0,
      composerBbox.y + composerBbox.height + padding - titleBbox.y,
    ]);
  }, [title, composer, defaultX, defaultY]);

  useLayoutEffect(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const bbox = g.getBBox();
    const y = defaultY - bbox.height / 2;
    // const y = defaultY - visualCenterY;
    setGroupPos([defaultX, y]);
  }, [titlePos, defaultX, defaultY]);

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
      <g
        fontFamily={SvgDefault.composerFont}
        fontSize={composer.fontSize}
        fontWeight={300}
        ref={composerRef}
      >
        {createTextLines(
          composer.items,
          composer.fontSize,
          composer.lineHeight,
        )}
      </g>
      <g
        fontFamily={SvgDefault.titleFont}
        fontSize={title.fontSize}
        transform={`${Vec2.toStyle([new Vec2(...titlePos)])}`}
        fontWeight={700}
        ref={titleRef}
      >
        {createTextLines(title.items, title.fontSize, title.lineHeight)}
      </g>
    </g>
  );
}
