import type { SongAttributes } from "@vocaloid-birthday/common";
import { SVG, type Svg } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";

class CalendarSVG {
  private svg: Svg | null = null;

  init(svgElement: SVGSVGElement) {
    this.svg = SVG(svgElement);
    this.svg.rect(100, 100).fill("#f06");
  }
}

const calendarSVG = new CalendarSVG();

export default function SvgViewer({ song }: { song: SongAttributes | null }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current == null) return;
    calendarSVG.init(svgRef.current);
  }, []);

  return <svg ref={svgRef}></svg>;
}
