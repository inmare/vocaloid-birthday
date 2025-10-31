import "@/fonts.css";
import "@/index.css";
import { AuthProvider } from "@components/AuthProvider";
import About from "@components/ui/pages/About.tsx";
import Admin from "@components/ui/pages/Admin.tsx";
import App from "@components/ui/pages/App";
import OtherPageLayout from "@components/ui/pages/OtherPageLayout";
import Progress from "@components/ui/pages/Progress";
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
