import sampleImage from "@assets/lustorus-sample.jpg";
import Guideline from "@components/ui/svg/Guideline";
import { Vec2 } from "@components/utils";
import Colorful from "@uiw/react-color-colorful";
import { type SongWithPVs } from "@vocaloid-birthday/common";
import dayjs from "dayjs";
import QRCode from "qrcode-svg";
import { useRef, useState } from "react";
const DATE_FONT_FAMILY = "AbrilFatface-Regular, 'Abril Fatface'";

export default function SvgViewer({
  month,
  date,
  song,
  isAdmin,
}: {
  month: number;
  date: number;
  song: SongWithPVs | null;
  isAdmin: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const factor = 5; // 좌표를 되도록 정수로 지정하기 위한 factor
  const viewBoxX = 106 * factor;
  const viewBoxY = 156 * factor;
  const svgSize = new Vec2(viewBoxX, viewBoxY);

  const publishDate = dayjs()
    .set("year", 2026)
    .set("month", month - 1)
    .set("date", date);

  const dateString = publishDate.format("MM.DD ddd").toUpperCase();

  const [accentColor, setAccentColor] = useState<string>("#000000");

  // const [pickColor, setPickColor] = useState(false);

  return (
    <>
      <div className="grid h-full overflow-auto p-5">
        <div style={{ width: "100%" }}>
          <svg
            ref={svgRef}
            viewBox={Vec2.toStyle([new Vec2(0, 0), svgSize])}
            className="shadow-[0_0_5px] shadow-zinc-950"
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
              fontFamily={DATE_FONT_FAMILY}
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
              fontFamily={DATE_FONT_FAMILY}
              fill={accentColor}
              fontSize={160}
              transform={`translate(${svgSize.x / 2}, 450)`}
            >
              <tspan>{publishDate.get("date")}</tspan>
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
            <g transform={`translate(35, 670)`}>
              <text
                // transform={`translate(0, 10)`}
                color="#000000"
                fontFamily="LINE Seed JP"
                textAnchor="start"
                fontSize={36}
              >
                <tspan>
                  {song
                    ? song.composer.split("feat.")[0].trim()
                    : "Lorem Ipsum"}
                </tspan>
              </text>
              <text
                transform={`translate(0, 70)`}
                color="#000000"
                fontFamily="LINE Seed JP"
                textAnchor="start"
                fontSize={70}
                fontWeight={700}
                letterSpacing={"-.1em"}
              >
                <tspan>{song ? song.title : "Lorem Ipsum"}</tspan>
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
        </div>
        {isAdmin && (
          <div className="w-full grid gap-1 py-1">
            <textarea className="bg-cyan-50 py-2 px-3 rounded-lg text-zinc-950" />
            <textarea className="bg-cyan-50 py-2 px-3 rounded-lg text-zinc-950" />
            <textarea className="bg-cyan-50 py-2 px-3 rounded-lg text-zinc-950" />
            <textarea className="bg-cyan-50 py-2 px-3 rounded-lg text-zinc-950" />

            <Colorful
              color={accentColor}
              disableAlpha={true}
              onChange={(color) => {
                setAccentColor(color.hex);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
