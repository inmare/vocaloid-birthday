import StyledNavLink from "@/components/ui/StyledNavLink";
import { Outlet } from "react-router";

export default function OtherPageLayout() {
  return (
    <>
      <div className="grid h-dvh grid-rows-[auto_1fr]">
        <header className="flex flex-row content-center justify-center gap-4 p-3">
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/about">About</StyledNavLink>
          <StyledNavLink to="/progress">Progress</StyledNavLink>
        </header>
        <div className="h-full min-h-0">
          <Outlet />
        </div>
      </div>
    </>
  );
}
