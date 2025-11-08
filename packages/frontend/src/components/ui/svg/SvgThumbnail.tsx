import { SvgContext } from "@/components/SvgContext";
import SvgDefault from "@/constants/svgDefaults";
import sampleImage from "@assets/no-image.png";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export default function SvgThumbnail() {
  const rectWidth = 80;
  const rectHeight = 65;
  const rectX = SvgDefault.sizeX / 2 - rectWidth / 2;
  const rectY = 60 - rectHeight / 2;

  const clipPathId = "thumbnail";

  const { fragment } = useContext(SvgContext);

  const imageRef = useRef<SVGImageElement | null>(null);
  const [imageLink, setImageLink] = useState<string>(sampleImage);
  const [transformStr, setTransformStr] = useState<string>("");

  useEffect(() => {
    const image = new Image();
    image.src = sampleImage;
    image.onload = () => {
      const w = image.width;
      const h = image.height;
      const scale = SvgDefault.imageScale;
      const x = SvgDefault.sizeX / 2 - (w * scale) / 2;
      const y = 60 - (h * scale) / 2;
      setTransformStr(`translate(${x}, ${y}) scale(${scale})`);
    };
  }, []);

  useEffect(() => {
    setImageLink(fragment.imageLink || sampleImage);
  }, [fragment.imageLink]);

  useLayoutEffect(() => {
    if (!imageRef.current) return;
    const imgSvg = imageRef.current;
    const bbox = imgSvg.getBBox();
    const x =
      SvgDefault.sizeX / 2 -
      (bbox.width * fragment.imageScale) / 2 +
      fragment.imageX;
    const y = 60 - (bbox.height * fragment.imageScale) / 2 + fragment.imageY;
    setTransformStr(`translate(${x}, ${y}) scale(${fragment.imageScale})`);
  }, [fragment.imageX, fragment.imageY, fragment.imageScale]);

  return (
    <>
      <clipPath id={clipPathId}>
        <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} />
      </clipPath>

      <g clipPath={`url(#${clipPathId})`}>
        {/* 배경용 placeholder */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          opacity={0.5}
        />
        {/* 이미지 */}
        <image ref={imageRef} href={imageLink} transform={transformStr} />
        {/* 그림자 */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
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
