import { type SongWithPVs } from "@vocaloid-birthday/common";
import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { styled } from "styled-components";
import { Vec2 } from "./utils";
import dayjs from "dayjs";

import QRCode from "qrcode-svg";

import sampleImage from "../assets/lustorus-sample.jpg";
import Guideline from "./Guideline";

const DATE_FONT_FAMILY = "AbrilFatface-Regular, 'Abril Fatface'";

// class CalendarSvg {
//   private svg: Svg | null = null;
//   private svgSize: Vec2 = new Vec2(106 * 5, 156 * 5);
//   private dateColor = {
//     sat: "#ff5555",
//     sun: "#5555ff",
//     normal: "#000000",
//   };
//   public accentColor = "#18298a";
//   public components: {
//     mainDate: Text | null;
//     dividerLine: Line | null;
//     shadowRect: Rect | null;
//   } = {
//     mainDate: null,
//     dividerLine: null,
//     shadowRect: null,
//   };

//   init(svgElement: SVGSVGElement) {
//     this.svg = SVG(svgElement);
//     this.svg.clear();

//     // Set svg size
//     this.svg.viewbox(0, 0, ...this.svgSize.array);

//     // Add guideline
//     const guidePad = 3 * 5;
//     this.guideline(new Vec2(0, guidePad), new Vec2(this.svgSize.x, guidePad));
//     this.guideline(
//       new Vec2(0, this.svgSize.y - guidePad),
//       new Vec2(this.svgSize.x, this.svgSize.y - guidePad)
//     );
//     this.guideline(new Vec2(guidePad, 0), new Vec2(guidePad, this.svgSize.y));
//     this.guideline(
//       new Vec2(this.svgSize.x - guidePad, 0),
//       new Vec2(this.svgSize.x - guidePad, this.svgSize.y)
//     );

//     // Add top text
//     const topDate = this.svg
//       .text("06.27 FRI")
//       .fill(this.dateColor.normal)
//       .font({
//         family: DATE_FONT_FAMILY,
//         size: 36,
//         anchor: "middle",
//       });
//     this.moveElement(topDate, "center", 60);

//     // Add clip path
//     const clipRectSize = 250;
//     const clipRect = this.svg
//       .rect(clipRectSize, clipRectSize)
//       .radius(20)
//       .center(this.svgSize.x / 2, 230);

//     this.components.shadowRect = this.svg
//       .rect(clipRectSize, clipRectSize)
//       .center(this.svgSize.x / 2, 230)
//       .radius(20)
//       .fill(this.accentColor)
//       .opacity(0.5);
//     this.components.shadowRect.filterWith(function (add) {
//       add.gaussianBlur(10, 10);
//     });

//     // Add thumbnail
//     const g = this.svg.group();
//     const thumbnail = g.image(sampleImage);
//     thumbnail.scale(0.35).translate(40, 105);
//     g.clipWith(clipRect);

//     // Add main date
//     this.components.mainDate = this.svg.text("27").fill(this.accentColor).font({
//       family: DATE_FONT_FAMILY,
//       size: 160,
//       anchor: "middle",
//     });
//     this.moveElement(this.components.mainDate, "center", 395);

//     // Add sample lyrics string
//     const lyricsText = this.svg
//       .text("아아, 하늘은 이런 색이었구나")
//       .fill(this.dateColor.normal)
//       .font({
//         family: "BookkMyungjo-Lt, 'Bookk Myungjo'",
//         size: 20,
//         anchor: "middle",
//       });
//     this.moveElement(lyricsText, "center", 540);

//     // Add divider line
//     const dividerPad = 90;
//     const dviderY = 580;
//     const dividerStart = new Vec2(dividerPad, dviderY).array;
//     const dividerEnd = new Vec2(this.svgSize.x - dividerPad, dviderY).array;
//     this.components.dividerLine = this.svg
//       .line(...dividerStart, ...dividerEnd)
//       .stroke({ width: 1, color: this.accentColor });

//     // Add caption
//     const caption = this.svg.text("러스트러스, *Luna").fill("#000000").font({
//       family: "Pretendard Variable JP",
//       size: 12,
//       weight: 200,
//       anchor: "middle",
//     });
//     caption.translate(this.svgSize.x / 2, 600);

//     // Add composer and title
//     const composer = this.svg.text("*Luna").fill("#000000").font({
//       family: "LINE Seed JP",
//       size: 36,
//       weight: 400,
//       anchor: "start",
//     });
//     composer.translate(30, this.svgSize.y - 40 - 64);

//     const title = this.svg.text("ラストラス").font({
//       family: "LINE Seed JP",
//       size: 64,
//       weight: 700,
//       anchor: "start",
//       "letter-spacing": "-.1em",
//     });
//     title.translate(30, this.svgSize.y - 40);

//     // Add qr code
//     const qrCode = this.svg.image(sampleQrCode);
//     qrCode.translate(this.svgSize.x - 120, this.svgSize.y - 120).scale(0.6);
//   }

//   redrawAccentColor(color: string) {
//     this.accentColor = color;
//     // console.log(this.accentColor);
//     const dividerLine = this.components.dividerLine;
//     if (dividerLine) {
//       dividerLine.stroke(this.accentColor);
//       console.log(dividerLine.fill);
//     }
//     const mainDate = this.components.mainDate;
//     if (mainDate) {
//       mainDate.fill(this.accentColor);
//     }
//     const shadowRect = this.components.shadowRect;
//     if (shadowRect) {
//       shadowRect.fill(this.accentColor);
//     }
//   }

//   private guideline(start: Vec2, end: Vec2) {
//     if (this.svg == null) return;
//     this.svg
//       .line(...start.array, ...end.array)
//       .stroke({ width: 2, color: "#cccccc" });
//   }

//   private moveElement(element: Text, x: number | "center", y: number) {
//     const bbox = element.bbox();
//     const newX = x === "center" ? this.svgSize.x / 2 : x;
//     const newY = y + bbox.height / 2;
//     element.transform({
//       translate: [newX, newY],
//     });
//   }
// }

const SvgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  svg {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.4);
    scale: 0.75;
  }
`;

export default function SvgViewer({ song }: { song: SongWithPVs | null }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // const calendarSVG = new CalendarSvg();
  const factor = 5; // 좌표를 되도록 정수로 지정하기 위한 factor
  const viewBoxX = 106 * factor;
  const viewBoxY = 156 * factor;
  const svgSize = new Vec2(viewBoxX, viewBoxY);

  const publishDate = dayjs(song?.publishDate).set("year", 2026);
  const dateString = publishDate.format("MM.DD ddd").toUpperCase();

  const [accentColor, setAccentColor] = useState<string>("#000000");

  return (
    <>
      <SvgWrapper>
        <svg ref={svgRef} viewBox={Vec2.toStyle([new Vec2(0, 0), svgSize])}>
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
              <tspan>*Luna</tspan>
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
              <tspan>ラストラス</tspan>
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
        <input
          type="color"
          name=""
          id=""
          onChange={(event: ChangeEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            setAccentColor(value);
            // if (svgRef.current) calendarSVG.init(svgRef.current);
            // calendarSVG.redrawAccentColor(value);
          }}
        />
      </SvgWrapper>
    </>
  );
}
