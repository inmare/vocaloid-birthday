import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function ImageInput({
  setImageLink,
}: {
  setImageLink: (link: string) => void;
}) {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const divClass = {
    active: "bg-cyan-900 border-cyan-700",
    deactive: "bg-transparent border-cyan-800",
  };

  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    const detectClick = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;

      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSelected(false);
      }
    };

    const detectPaste = async (event: ClipboardEvent) => {
      if (!selected) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (!file) continue;
          // 이미지가 webp면 png로 변환
          if (file.type === "image/webp") {
            console.log("webp를 png로 변환합니다.");
            const img = document.createElement("img");
            const imgUrl = URL.createObjectURL(file);
            img.src = imgUrl;
            await img.decode();
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (!blob) return;
              const url = URL.createObjectURL(blob);
              setImageLink(url);
              URL.revokeObjectURL(imgUrl);
            }, "image/png");
          } else {
            const url = URL.createObjectURL(file);
            setImageLink(url);
          }
        }
      }
      setSelected(false);
    };

    if (selected) {
      window.addEventListener("click", detectClick);
      window.addEventListener("paste", detectPaste);
    }

    return () => {
      window.removeEventListener("click", detectClick);
      window.removeEventListener("paste", detectPaste);
    };
  }, [selected, inputRef, setImageLink]);

  return (
    <div
      ref={inputRef}
      className={clsx(
        "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed py-5",
        {
          [divClass.active]: selected,
          [divClass.deactive]: !selected,
        },
      )}
      onClick={() => {
        setSelected(!selected);
      }}
    >
      <p className="text-sm select-none">클릭 후 파일 붙여넣기</p>
    </div>
  );
}
