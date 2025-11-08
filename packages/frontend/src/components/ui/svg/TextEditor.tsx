import CustomTextarea from "@/components/ui/fragments/CustomTextarea";
import { TextEditContext } from "@components/TextEditContext";
import { type ChangeEvent, useContext, useMemo } from "react";
import CustomInput from "../fragments/CustomInput";
import CutstomLabel from "../fragments/CustomLabel";

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
        <CustomTextarea
          disabled={!item}
          onChange={handleTextChange}
          value={item ? item.text : ""}
          className="col-span-2"
        />
        <CutstomLabel>OffsetX</CutstomLabel>
        <CustomInput step={0.1} />
        <CutstomLabel>OffsetY</CutstomLabel>
        <CustomInput step={0.1} />
        <CutstomLabel>Leading</CutstomLabel>
        <CustomInput step={0.1} />
      </div>
    </div>
  );
}
