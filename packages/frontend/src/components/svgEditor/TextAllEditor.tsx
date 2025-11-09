import { TextEditContext } from "@components/TextEditContext";
import { Input, Label } from "@components/ui";
import { useContext, type ChangeEvent } from "react";

export default function TextAllEditor() {
  const textContext = useContext(TextEditContext);

  const updateFontSize = (event: ChangeEvent<HTMLInputElement>) => {
    textContext.updateData((draft) => {
      draft.fontSize = parseFloat(event.target.value);
    });
  };

  const updateLineHeight = (event: ChangeEvent<HTMLInputElement>) => {
    textContext.updateData((draft) => {
      draft.lineHeight = parseFloat(event.target.value);
    });
  };

  return (
    <div className="col-span-2 grid grid-cols-2 gap-1">
      <Label>FontSize</Label>
      <Label>LineHeight</Label>
      <Input
        defaultValue={textContext.data.fontSize}
        onChange={updateFontSize}
        step={0.5}
      />
      <Input
        defaultValue={textContext.data.lineHeight}
        onChange={updateLineHeight}
        step={0.1}
      />
    </div>
  );
}
