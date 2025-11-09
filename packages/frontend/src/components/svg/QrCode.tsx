import { Vec2 } from "@components/utils";
import QRCode from "qrcode-svg";
import { useEffect, useState } from "react";

export default function QrCode({
  month,
  date,
}: {
  month: number;
  date: number;
}) {
  const [qrSvgString, setQrSvgString] = useState<string>("");

  const qrSize = 16;
  const qrPos = new Vec2(85.5 - qrSize / 2, 11);

  useEffect(() => {
    const qrUrl = `https://vocalendar.moe/2026/${month}/${date}`;
    const qrCode = new QRCode({
      content: qrUrl,
      padding: 1,
      join: true,
      width: qrSize,
      height: qrSize,
    });

    setQrSvgString(qrCode.svg({ container: "none" }));
  }, [month, date]);

  return (
    <g
      dangerouslySetInnerHTML={{ __html: qrSvgString }}
      transform={`${Vec2.toStyle([qrPos])}`}
    ></g>
  );
}
