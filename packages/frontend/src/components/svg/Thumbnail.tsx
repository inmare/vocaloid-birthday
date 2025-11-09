import SvgDefault from "@/constants/svgDefaults";
import sampleImage from "@assets/no-image.png";
import { SvgContext } from "@components/SvgContext";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export default function Thumbnail() {
  const rectWidth = 80;
  const rectHeight = 65;
  const rectX = SvgDefault.sizeX / 2 - rectWidth / 2;
  const rectY = 60 - rectHeight / 2;

  const { fragment } = useContext(SvgContext);

  const imageRef = useRef<SVGImageElement | null>(null);
  const [imageLink, setImageLink] = useState<string>(sampleImage);
  const [transformStr, setTransformStr] = useState<string>("");

  useEffect(() => {
    setImageLink(fragment.imageLink || sampleImage);
  }, [fragment.imageLink]);

  useLayoutEffect(() => {
    if (!imageRef.current) return;
    const imgSvg = imageRef.current;
    const calcImagePos = () => {
      const bbox = imgSvg.getBBox();
      const x =
        SvgDefault.sizeX / 2 -
        (bbox.width * fragment.imageScale) / 2 +
        fragment.imageX;
      const y = 60 - (bbox.height * fragment.imageScale) / 2 + fragment.imageY;
      setTransformStr(`translate(${x}, ${y}) scale(${fragment.imageScale})`);
    };
    // 로드되었을 때도 이미지 위치를 계산하게 이벤트 리스너 추가
    imgSvg.addEventListener("load", calcImagePos);
    calcImagePos();
    return () => {
      imgSvg.removeEventListener("load", calcImagePos);
    };
  }, [imageLink, fragment.imageX, fragment.imageY, fragment.imageScale]);

  const clipPathId = "thumbnail";
  const blurEffectId = "blur";

  return (
    <>
      <clipPath id={clipPathId}>
        <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} />
      </clipPath>
      <filter id={blurEffectId}>
        <feGaussianBlur stdDeviation={2} />
      </filter>
      <g clipPath={`url(#${clipPathId})`}>
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          opacity={0.5}
        />
        {/* 이미지 */}
        <image
          id={SvgDefault.imageId}
          ref={imageRef}
          xlinkHref={imageLink}
          transform={transformStr}
        />
        {/* 그림자 */}
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill="none"
          stroke="#000000"
          strokeWidth={2}
          opacity={0.75}
          filter={`url(#${blurEffectId})`}
        />
      </g>
    </>
  );
}
