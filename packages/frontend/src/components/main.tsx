import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.tsx";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/admin",
    element: <div>Admin Page</div>,
  },
  {
    path: "/about",
    element: <div>About Page</div>,
  },
  {
    path: "/progress",
    element: <div>Progress Page</div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </StrictMode>
);
