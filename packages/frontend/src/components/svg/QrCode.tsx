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

  useEffect(() => {
    const qrUrl = `https://vocalendar.moe/2026/${month}/${date}`;
    const qrCode = new QRCode({
      content: qrUrl,
      padding: 1,
      join: true,
      container: "svg",
    });

    const base64 = btoa(qrCode.svg());
    const href = `data:image/svg+xml;base64,${base64}`;
    setQrSvgString(href);
  }, [month, date]);

  const qrSize = 16;
  const qrPos = new Vec2(85.5 - qrSize / 2, 11);

  return (
    <image
      href={qrSvgString}
      transform={`${Vec2.toStyle([qrPos])}`}
      width={qrSize}
      height={qrSize}
    />
  );
}
