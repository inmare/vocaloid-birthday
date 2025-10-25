import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../fonts.css";

import { createGlobalStyle } from "styled-components";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.tsx";
import OtherPageLayout from "./OtherPageLayout.tsx";
import Progress from "./Progress.tsx";
import Admin from "./Admin.tsx";
import { AuthProvider } from "./AuthProvider.tsx";

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
    Component: OtherPageLayout,
    children: [
      {
        path: "/admin",
        Component: Admin,
      },
      {
        path: "/about",
        element: <div>About Page</div>,
      },
      {
        path: "/progress",
        Component: Progress,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <GlobalStyle />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
