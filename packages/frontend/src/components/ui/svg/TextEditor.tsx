import CustomTextarea from "@/components/ui/fragments/CustomTextarea";
import { TextEditContext } from "@components/TextEditContext";
import type { TextItem } from "@components/type";
import { type ChangeEvent, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

export default function TextEditor() {
  const labelClassName = "font-monospace pr-1";
  const inputClassName =
    "min-w-0 border-none bg-zinc-50 pl-1 text-zinc-950 outline-none";

  const { data, updateData } = useContext(TextEditContext);
  const [item, updateItem] = useImmer<TextItem | null>(null);

  useEffect(() => {
    const lines = data.items;
    for (const line of lines) {
      line.forEach((value) => {
        if (value.selected) updateItem(value);
      });
    }
  }, [data]);

  useEffect(() => {
    if (!item) return;
    updateData((draft) => {
      for (const line of draft.items) {
        line.forEach((value, index) => {
          if (value.id === item.id) line[index] = item;
        });
      }
    });
  }, [item]);

  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-1">
        <CustomTextarea
          disabled={!item}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            updateItem((draft) => {
              if (draft) {
                draft.text = event.target.value;
              }
            });
          }}
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
