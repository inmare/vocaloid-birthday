import { SvgContext } from "@/components/SvgContext";
import SvgDefault from "@/constants/svgConfig";
import sampleImage from "@assets/no-image.png";
import { useContext, useMemo, useRef } from "react";

export default function SvgThumbnail() {
  const width = 80;
  const height = 65;
  const x = SvgDefault.sizeX / 2 - width / 2;
  const y = 60 - height / 2;

  const clipPathId = "thumbnail";

  const { fragment } = useContext(SvgContext);

  const imageLink = useMemo(() => {
    return fragment.imageBase64 ? fragment.imageBase64 : sampleImage;
  }, [fragment.imageBase64]);

  const imageRef = useRef<SVGImageElement | null>(null);

  const imageTransfomString = useMemo(() => {
    if (!imageRef.current) return `translate(0, 0) scale(1)`;
    const imgSvg = imageRef.current;
    const bbox = imgSvg.getBBox();
    const x =
      SvgDefault.sizeX / 2 -
      (bbox.width * fragment.imageScale) / 2 +
      fragment.imageX;
    const y = 60 - (bbox.height * fragment.imageScale) / 2 + fragment.imageY;
    return `translate(${x}, ${y}) scale(${fragment.imageScale})`;
  }, [imageRef, fragment.imageX, fragment.imageY, fragment.imageScale]);

  return (
    <>
      <clipPath id={clipPathId}>
        <rect {...{ x, y, width, height }} />
      </clipPath>

      <g clipPath={`url(#${clipPathId})`}>
        {/* 배경용 placeholder */}
        <rect {...{ x, y, width, height }} opacity={0.5} />
        {/* 이미지 */}
        <image
          ref={imageRef}
          href={imageLink}
          transform={imageTransfomString}
        />
        {/* 그림자 */}
        <rect
          {...{ x, y, width, height }}
          fill="transparent"
          stroke="#000000"
          strokeWidth={2}
          opacity={0.75}
          filter="blur(2px)"
        />
      </g>
    </>
  );
}
