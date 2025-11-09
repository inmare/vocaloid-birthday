import Textarea from "@/components/ui/Textarea";
import { TextEditContext } from "@components/TextEditContext";
import { type ChangeEvent, useContext, useMemo } from "react";
import Input from "../ui/Input";
import Label from "../ui/Label";

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
        <Input step={0.1} />
        <Label>OffsetY</Label>
        <Input step={0.1} />
        <Label>Leading</Label>
        <Input step={0.1} />
      </div>
    </div>
  );
}
