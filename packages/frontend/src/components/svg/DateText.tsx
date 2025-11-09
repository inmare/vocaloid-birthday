import SvgDefault from "@/constants/svgDefaults";
import { SvgContext } from "@components/SvgContext";
import { Vec2 } from "@components/utils";
import dayjs from "dayjs";
import { useContext } from "react";

export default function DateText({
  month,
  date,
}: {
  month: number;
  date: number;
}) {
  const dayjsDate = dayjs(`2026-${month}-${date}`);
  const color = {
    normal: "#000000",
    saturday: "#1567b4",
    sunday: "#c22828",
  };

  const getColor = () => {
    if (dayjsDate.day() === 0) {
      return color.sunday;
    } else if (dayjsDate.day() === 6) {
      return color.saturday;
    }
    return color.normal;
  };

  const textPos = new Vec2(13, 24);
  const dateFontSize = 16;
  const dayFontSize = 7;

  const dividerX = 12.85;
  const dividerY = 26;

  const { sizeX, dateFont } = SvgDefault;
  const { fragment } = useContext(SvgContext);

  return (
    <>
      <text
        transform={`${Vec2.toStyle([textPos])}`}
        fontFamily={dateFont}
        textAnchor="start"
      >
        <tspan fontSize={dateFontSize}>
          {dayjsDate.format("M.D").toUpperCase()}
        </tspan>
        <tspan fill={getColor()} fontSize={dayFontSize}>
          {dayjsDate.format(" ddd").toUpperCase().replaceAll(" ", "\u00a0")}
        </tspan>
      </text>
      <line
        x1={dividerX}
        y1={dividerY}
        x2={sizeX - dividerX - 17} // qr코드까지 고려한 크기 조정
        y2={dividerY}
        strokeWidth={0.4}
        stroke={fragment.accentColor}
      ></line>
    </>
  );
}
