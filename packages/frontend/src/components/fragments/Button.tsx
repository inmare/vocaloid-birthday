import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export default function Button({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        className,
        "cursor-pointer bg-cyan-900 px-1 text-zinc-50 active:bg-cyan-800",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
