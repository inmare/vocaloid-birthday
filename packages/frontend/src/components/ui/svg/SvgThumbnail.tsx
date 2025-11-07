import { SvgSizeX } from "@/constants/svgConfig";
import sampleImage from "@assets/no-image.png";
import { Vec2 } from "@components/utils";

export default function Thumbnail() {
  const width = 80;
  const height = 65;
  const x = SvgSizeX / 2 - width / 2;
  const y = 60 - height / 2;

  const clipPathId = "thumbnail";
  const imageScale = 4.5 / 100;
  const imagePos = new Vec2(0, 15);

  return (
    <>
      <clipPath id={clipPathId}>
        <rect {...{ x, y, width, height }} />
      </clipPath>

      <g clipPath={`url(#${clipPathId})`}>
        <rect {...{ x, y, width, height }} opacity={0.5} />
        <image
          href={sampleImage}
          transform={`${Vec2.toStyle([imagePos])} scale(${imageScale})`}
        />
        <rect
          {...{ x, y, width, height }}
          fill="transparent"
          stroke="#000000"
          strokeWidth={2}
          opacity={0.5}
          filter="blur(2px)"
        />
      </g>
    </>
  );
}
