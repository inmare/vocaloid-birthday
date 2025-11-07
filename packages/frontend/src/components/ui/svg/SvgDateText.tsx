import { Vec2 } from "@/components/utils";
import { SvgDateFont, SvgSizeX } from "@/constants/svgConfig";
import dayjs from "dayjs";

export default function DateText({
  month,
  date,
  accentColor,
}: {
  month: number;
  date: number;
  accentColor: string;
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

  return (
    <>
      <text
        transform={`${Vec2.toStyle([textPos])}`}
        fontFamily={SvgDateFont}
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
        x2={SvgSizeX - dividerX - 17}
        y2={dividerY}
        strokeWidth={0.4}
        stroke={accentColor}
      ></line>
    </>
  );
}
