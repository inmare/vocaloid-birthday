import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      return resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

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
            // 여기서 파일 업로드 처리 로직을 추가하세요.
            const imgBase64 = await fileToBase64(file);
            setImageBase64(imgBase64);
          }
        }
      }
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
      <p className="text-sm select-none">클릭 후 파일 / 유튜브 링크 붙여넣기</p>
    </div>
  );
}
