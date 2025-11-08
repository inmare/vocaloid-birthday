import type { ImageConfig } from "@/components/type";
import { SvgSizeX } from "@/constants/svgConfig";
import sampleImage from "@assets/no-image.png";
import { useEffect, useMemo, useRef } from "react";

export default function SvgThumbnail({
  imageBase64,
  imagePos,
}: {
  imageBase64: string | null;
  imagePos: ImageConfig;
}) {
  const width = 80;
  const height = 65;
  const x = SvgSizeX / 2 - width / 2;
  const y = 60 - height / 2;

  const clipPathId = "thumbnail";

  const imageLink = useMemo(() => {
    return imageBase64 ? imageBase64 : sampleImage;
  }, [imageBase64]);

  const imageRef = useRef<SVGImageElement | null>(null);

  useEffect(() => {
    if (!imageRef.current) return null;
    if (!imagePos) return { x: 0, y: 0, scale: 1 };

    const imgSvg = imageRef.current;
    const bbox = imgSvg.getBBox();
    const x = SvgSizeX / 2 - (bbox.width * imagePos.scale) / 2;
    const y = 60 - (bbox.height * imagePos.scale) / 2;

    return {
      x: x + imagePos.x,
      y: y + imagePos.y,
      scale: imagePos.scale,
    };
  }, [imageRef, imagePos]);

  return (
    <>
      <clipPath id={clipPathId}>
        <rect {...{ x, y, width, height }} />
      </clipPath>

      <g clipPath={`url(#${clipPathId})`}>
        <rect {...{ x, y, width, height }} opacity={0.5} />
        <image
          ref={imageRef}
          href={imageLink}
          transform={`translate(${imageRealPos?.x}, ${imageRealPos?.y}) scale(${imageRealPos?.scale})`}
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
