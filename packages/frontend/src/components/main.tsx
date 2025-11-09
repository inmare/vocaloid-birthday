import About from "@/components/pages/About";
import Admin from "@/components/pages/Admin";
import App from "@/components/pages/App";
import OtherPageLayout from "@/components/pages/OtherPageLayout";
import Progress from "@/components/pages/Progress";
import "@/fonts.css";
import "@/index.css";
import { AuthProvider } from "@components/AuthProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

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
        Component: About,
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
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
