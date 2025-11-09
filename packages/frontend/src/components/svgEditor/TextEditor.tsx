import { TextEditContext } from "@components/TextEditContext";
import { Input, Label, Textarea } from "@components/ui";
import { type ChangeEvent, useContext, useMemo } from "react";
import type { TextTypo } from "../type";

export default function TextEditor() {
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

  const handleValueChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof TextTypo,
  ) => {
    if (!item) return;
    const newValue = parseFloat(event.target.value);
    const id = item.id;
    updateData((draft) => {
      for (const line of draft.items) {
        const idx = line.findIndex((value) => value.id === id);
        if (idx !== -1) {
          line[idx].typo[field] = newValue;
          break;
        }
      }
    });
  };

  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-1">
        <Textarea
          disabled={!item}
          onChange={handleTextChange}
          value={item ? item.text : ""}
          className="col-span-2"
        />
        <Label>OffsetX</Label>
        <Input
          onChange={(event) => handleValueChange(event, "offsetX")}
          step={0.1}
        />
        <Label>OffsetY</Label>
        <Input
          onChange={(event) => handleValueChange(event, "offsetY")}
          step={0.1}
        />
        <Label>Leading</Label>
        <Input
          onChange={(event) => handleValueChange(event, "leading")}
          step={0.1}
        />
      </div>
    </div>
  );
}
