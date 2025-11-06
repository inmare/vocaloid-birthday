import { Vec2 } from "@/components/utils";
import { SvgDateFont } from "@/constants/svgConfig";
import dayjs from "dayjs";

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
    saturday: "#0000FF",
    sunday: "#FF0000",
  };

  const getColor = () => {
    if (dayjsDate.day() === 0) {
      return color.sunday;
    } else if (dayjsDate.day() === 6) {
      return color.saturday;
    }
    return color.normal;
  };

  const textPos = new Vec2(13, 20);
  const dateFontSize = 13;
  const dayFontSize = 6;

  return (
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
  );
}
