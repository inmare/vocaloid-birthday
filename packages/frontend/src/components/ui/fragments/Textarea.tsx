import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

export default function Textarea({
  className,
  children,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      spellCheck={false}
      className={clsx(
        className,
        "rounded-lg border-none bg-zinc-50 px-2 py-1 text-zinc-950 outline-none",
      )}
      {...rest}
    >
      {children}
    </textarea>
  );
}
