import { type DateSelectMode } from "@components/type";
import clsx from "clsx";

export default function ModeSelectBtn({
  mode,
  setMode,
}: {
  mode: DateSelectMode;
  setMode: (mode: DateSelectMode) => void;
}) {
  const classList = {
    active: "bg-cyan-700",
    deactive: "bg-zinc-700 opacity-50",
  };

  return (
    <>
      <div className="flex flex-row gap-0.5">
        <button
          onClick={() => {
            setMode("month");
          }}
          className={clsx("rounded-l-xl p-2 pr-3 pl-4", {
            [classList.active]: mode === "month",
            [classList.deactive]: mode === "date",
          })}
        >
          월
        </button>
        <button
          onClick={() => {
            setMode("date");
          }}
          className={clsx("rounded-r-xl p-2 pr-4 pl-3", {
            [classList.active]: mode === "date",
            [classList.deactive]: mode === "month",
          })}
        >
          일
        </button>
      </div>
    </>
  );
}
