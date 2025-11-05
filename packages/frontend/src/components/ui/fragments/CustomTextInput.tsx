import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export default function CustomTextInput({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      className={clsx(
        className,
        "rounded-lg border-none bg-zinc-50 px-2 py-1 text-zinc-950 outline-none",
      )}
      {...rest}
    />
  );
}
