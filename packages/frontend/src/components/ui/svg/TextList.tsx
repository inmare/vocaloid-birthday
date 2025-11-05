import { createEmptyItem } from "@/components/utils";
import { TextEditContext } from "@components/TextEditContext";
import Btn from "@components/ui/fragments/Btn";
import TextBtn from "@components/ui/fragments/TextBtn";
import { Plus } from "lucide-react";
import { useContext } from "react";

export default function TextList({ lineIndex }: { lineIndex: number }) {
  const { data, updateData } = useContext(TextEditContext);

  const addItem = () => {
    updateData((draft) => {
      draft.items.forEach((value, index) => {
        if (index === lineIndex) value.push(createEmptyItem());
      });
    });
  };

  const deleteItem = (id: number) => {
    updateData((draft) => {
      draft.items.forEach((value, index, array) => {
        array[index] = value.filter((itemValue) => {
          return itemValue.id !== id;
        });
      });

      draft.items = draft.items.filter((value) => {
        return value.length !== 0;
      });
    });
  };

  const updateItem = (id: number) => {
    updateData((draft) => {
      for (const line of draft.items) {
        line.forEach((value) => {
          if (value.id === id) value.selected = true;
          else value.selected = false;
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-[1fr_auto]">
      <div className="flex flex-row gap-1 overflow-x-auto whitespace-nowrap">
        {data.items[lineIndex].map((value) => {
          return (
            <TextBtn
              key={value.id}
              onDoubleClick={() => {
                deleteItem(value.id);
              }}
              onClick={() => {
                updateItem(value.id);
              }}
              toggled={value.selected}
            >
              {value.text.replaceAll(" ", "\u00a0")}
            </TextBtn>
          );
        })}
      </div>
      <Btn onClick={addItem} className="my-auto aspect-square rounded-full">
        <Plus size={16} />
      </Btn>
    </div>
  );
}
