import Input from "@/components/ui/fragments/Input";
import Label from "@/components/ui/fragments/Label";
import { TextEditContext } from "@components/TextEditContext";
import { useContext, type ChangeEvent } from "react";

export default function TextAllEditor({
  fontSize,
  lineHeight,
}: {
  fontSize?: number;
  lineHeight?: number;
}) {
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
      <Input defaultValue={fontSize} onChange={updateFontSize} step={1} />
      <Input defaultValue={lineHeight} onChange={updateLineHeight} step={0.1} />
    </div>
  );
}
