import {
  SvgDateFont,
  SvgFactor,
  SvgSizeX,
  SvgSizeY,
} from "@/constants/svgConfig";
import sampleImage from "@assets/lustorus-sample.jpg";
import type { TitleConfig } from "@components/type";
import Guideline from "@components/ui/svg/Guideline";
import { Vec2 } from "@components/utils";
import dayjs from "dayjs";
import QRCode from "qrcode-svg";
import { useRef } from "react";

export default function CalendarSvg({
  month,
  date,
  accentColor,
  titleConfig,
}: {
  month: number;
  date: number;
  accentColor: string;
  titleConfig: TitleConfig;
}) {
  const svgSize = new Vec2(SvgSizeX * SvgFactor, SvgSizeY * SvgFactor);
  const currentDate = dayjs()
    .set("year", 2026)
    .set("month", month - 1)
    .set("date", date);
  const dateString = currentDate.format("MM.DD ddd").toUpperCase();

  const svgRef = useRef<SVGSVGElement | null>(null);

  return (
    <>
      <svg
        ref={svgRef}
        viewBox={Vec2.toStyle([new Vec2(0, 0), svgSize])}
        xmlns="http://www.w3.org/2000/svg"
        className="w-75 shadow-[0_0_10px] shadow-zinc-400"
      >
        <clipPath id="thumbnail-clip">
          <rect
            x={(svgSize.x - 250) / 2}
            y={105}
            width={250}
            height={250}
            rx={20}
            ry={20}
          ></rect>
        </clipPath>
        <rect width={svgSize.x} height={svgSize.y} fill="#ffffff" />
        <Guideline factor={5} svgSize={svgSize} visible={true} />
        <text
          textAnchor="middle"
          fontFamily={SvgDateFont}
          fill="#000000"
          fontSize={36}
          transform={`translate(${svgSize.x / 2}, 60)`}
        >
          {dateString}
        </text>
        <g
          style={{
            clipPath: "url(#thumbnail-clip)",
          }}
        >
          <image
            href={sampleImage}
            transform={`translate(${
              svgSize.x / 2 - (1280 * 0.4) / 2
            }, 80) scale(0.4)`}
          ></image>
        </g>
        <text
          textAnchor="middle"
          fontFamily={SvgDateFont}
          fill={accentColor}
          fontSize={160}
          transform={`translate(${svgSize.x / 2}, 450)`}
        >
          <tspan>{currentDate.get("date")}</tspan>
        </text>
        <text
          transform={`translate(${svgSize.x / 2}, 500)`}
          textAnchor="middle"
          fontFamily="BookkMyungjo"
        >
          <tspan>아아, 하늘은 이런 색이었구나</tspan>
        </text>
        <line
          width={2}
          stroke={accentColor}
          x1={120}
          y1={460}
          x2={svgSize.x - 120}
          y2={460}
        ></line>
        <g transform={`translate(35, 600)`}>
          <text
            // transform={`translate(0, 10)`}
            color="#000000"
            fontFamily="LINE Seed JP"
            textAnchor="start"
            fontSize={30}
          >
            <tspan>TAK{/* 和田たけあき */}</tspan>
          </text>
          <text
            transform={`translate(-5, 50)`}
            color="#000000"
            fontFamily="LINE Seed JP"
            textAnchor="start"
            fontSize={46}
            fontWeight={700}
            letterSpacing={"0em"}
          >
            <tspan x={-23} y={0}>
              「１」{/* トラッシュ・ */}
            </tspan>
            <tspan x={0} y={48}>
              MELON{/* アンド・ */}
            </tspan>
            <tspan x={0} y={96}>
              COOKIE{/* トラッシュ! */}
            </tspan>
            {/* {textConfigList.map((value: TextConfig) => {
              const typo = value.typo;

              return (
                <>
                  <tspan
                    key={value.id}
                    dx={typo.offsetX}
                    letterSpacing={`${typo.spacing}em`}
                  >
                    {value.text}
                  </tspan>
                </>
              );
            })} */}
          </text>
        </g>
        <g
          dangerouslySetInnerHTML={{
            __html: new QRCode({
              content: "https://example.com",
              padding: 1,
              join: true,
              container: "none",
            }).svg(),
          }}
          transform={`translate(${100}, 100) scale(0.6)`}
        ></g>
      </svg>
    </>
  );
}
