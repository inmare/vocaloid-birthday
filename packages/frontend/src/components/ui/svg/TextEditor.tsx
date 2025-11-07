import CustomTextarea from "@/components/ui/fragments/CustomTextarea";
import { TextEditContext } from "@components/TextEditContext";
import { type ChangeEvent, useContext, useMemo } from "react";

export default function TextEditor() {
  const labelClassName = "font-monospace pr-1";
  const inputClassName =
    "min-w-0 border-none bg-zinc-50 pl-1 text-zinc-950 outline-none";

  const { data, updateData } = useContext(TextEditContext);

  const item = useMemo(() => {
    for (const line of data.items) {
      for (const value of line) {
        if (value.selected) return value;
      }
    }
    return null;
  }, [data.items]);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!item) return;

    const newText = event.target.value;
    const id = item.id;

    updateData((draft) => {
      for (const line of draft.items) {
        const idx = line.findIndex((value) => value.id === id);
        if (idx !== -1) {
          line[idx].text = newText;
          break;
        }
      }
    });
  };

  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-1">
        <CustomTextarea
          disabled={!item}
          onChange={handleTextChange}
          value={item ? item.text : ""}
          className="col-span-2"
        />
        <label className={labelClassName} htmlFor="offset-x">
          OffsetX
        </label>
        <input
          className={inputClassName}
          type="number"
          name="offset-x"
          step={0.1}
        />
        <label className={labelClassName} htmlFor="offset-y">
          OffsetY
        </label>
        <input
          className={inputClassName}
          type="number"
          name="offset-y"
          step={0.1}
        />
        <label className={labelClassName} htmlFor="leading">
          Leading
        </label>
        <input
          className={inputClassName}
          type="number"
          name="leading"
          step={0.1}
        />
      </div>
    </div>
  );
}
