import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface TextBtnAttributes extends ButtonHTMLAttributes<HTMLButtonElement> {
  toggled: boolean;
}

export default function Btn({
  toggled,
  className,
  children,
  ...rest
}: TextBtnAttributes) {
  return (
    <button
      className={clsx(
        className,
        "min-h-8 cursor-pointer px-2 py-0.5 text-zinc-50",
        { "bg-emerald-600": toggled, "bg-emerald-800": !toggled },
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
