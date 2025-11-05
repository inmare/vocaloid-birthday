import { createEmptyItem } from "@/components/utils";
import { TextEditContext } from "@components/TextEditContext";
import Btn from "@components/ui/fragments/Btn";
import TextList from "@components/ui/svg/TextList";
import { ListPlus } from "lucide-react";
import { useContext } from "react";

export default function TextViewer() {
  const { data, updateData } = useContext(TextEditContext);

  return (
    <div>
      <div className="grid-cols grid gap-2">
        {data.items.map((_value, index) => {
          return <TextList key={index} lineIndex={index} />;
        })}
        <Btn
          onClick={() => {
            updateData((draft) => {
              draft.items.push([createEmptyItem()]);
            });
          }}
          className="w-full rounded-lg"
        >
          <ListPlus className="mx-auto" />
        </Btn>
      </div>
    </div>
  );
}
