import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export default function Input({
  type,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type ? type : "number"}
      className={clsx(
        className,
        "min-w-0 border-none bg-zinc-50 pl-1 text-zinc-950 outline-none",
      )}
      {...rest}
    />
  );
}
