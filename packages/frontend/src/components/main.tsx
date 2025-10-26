import "@/fonts.css";
import "@/index.css";
import { AuthProvider } from "@components/AuthProvider";
import About from "@components/ui/pages/About.tsx";
import Admin from "@components/ui/pages/Admin.tsx";
import App from "@components/ui/pages/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import OtherPageLayout from "./ui/pages/OtherPageLayout.tsx";
import Progress from "./ui/pages/Progress.tsx";

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
