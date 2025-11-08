import clsx from "clsx";
import type { LabelHTMLAttributes } from "react";

export default function CutstomLabel({
  className,
  children,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  const inputClassName = "font-monospace pr-1";
  return (
    <label {...rest} className={clsx(className, inputClassName)}>
      {children}
    </label>
  );
}
