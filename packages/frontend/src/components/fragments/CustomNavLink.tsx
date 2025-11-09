import clsx from "clsx";
import { NavLink, type NavLinkProps } from "react-router";

export default function CustomNavLink(props: NavLinkProps) {
  return (
    <NavLink
      className={clsx(
        "font-monospace text-xl font-bold text-cyan-600 underline transition duration-100",
        "hover:text-cyan-500",
      )}
      {...props}
    />
  );
}
