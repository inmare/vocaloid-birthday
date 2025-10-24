import { NavLink, Outlet } from "react-router";
import { styled } from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100dvh;
  margin: auto;
`;

export default function OtherPageLayout() {
  return (
    <>
      <Wrapper>
        <header>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/progress">Progress</NavLink>
        </header>
        <Outlet />
      </Wrapper>
    </>
  );
}
