import CalendarInfo from "@/components/pages/CalendarInfo";
import "@/fonts.css";
import "@/index.css";
import { AuthProvider } from "@components/AuthProvider";
import About from "@components/pages/About";
import Admin from "@components/pages/Admin";
import App from "@components/pages/App";
import NotFound from "@components/pages/NotFound";
import OtherPageLayout from "@components/pages/OtherPageLayout";
import Progress from "@components/pages/Progress";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainCalendar from "./pages/MainCalendar";

dayjs.extend(customParseFormat);

function isValidDate(year: number, month: number, date: number) {
  return dayjs(`${year}-${month}-${date}`, "YYYY-M-D", true).isValid();
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },

  {
    Component: OtherPageLayout,
    errorElement: <NotFound />,
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
      {
        path: "/2026",
        Component: CalendarInfo,
        loader: () => {
          return { year: 2026 };
        },
      },
      {
        path: "/2026/:month/:date",
        Component: MainCalendar,
        errorElement: <NotFound />,
        loader: ({ params }) => {
          const month = Number(params.month);
          const date = Number(params.date);
          if (!isValidDate(2026, month, date)) {
            throw new Response("Not Found", { status: 404 });
          }
          return { year: 2026, month, date };
        },
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
