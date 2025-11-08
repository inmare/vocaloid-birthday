import { fileToBase64 } from "@components/utils";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function ImageInput({
  setImageBase64,
}: {
  setImageBase64: (base64: string) => void;
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
          if (file) {
            const imgBase64 = await fileToBase64(file);
            setImageBase64(imgBase64);
            break;
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
  }, [selected, inputRef, setImageBase64]);

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
