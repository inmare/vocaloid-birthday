import CustomNavLink from "@/components/ui/fragments/CustomNavLink";
import { Outlet } from "react-router";

export default function OtherPageLayout() {
  return (
    <>
      <div className="grid grid-rows-[auto_1fr] h-dvh">
        <header className="flex flex-row content-center justify-center gap-4 p-3">
          <CustomNavLink to="/">Home</CustomNavLink>
          <CustomNavLink to="/about">About</CustomNavLink>
          <CustomNavLink to="/progress">Progress</CustomNavLink>
        </header>
        <div className="h-full min-h-0">
          <Outlet />
        </div>
      </div>
    </>
  );
}
