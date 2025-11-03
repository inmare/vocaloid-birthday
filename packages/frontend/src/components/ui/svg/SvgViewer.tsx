import {
  DefaultTextTypo,
  DefaultTitleConfig,
  type LineConfig,
  type TextItemConfig,
  type TitleConfig,
} from "@components/type";
import Btn from "@components/ui/fragments/Btn";
import TextBtn from "@components/ui/fragments/TextBtn";
import CalendarSvg from "@components/ui/svg/CalendarSvg";
import Colorful from "@uiw/react-color-colorful";
import dayjs from "dayjs";
import { ListPlus, Plus } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useImmer, type Updater } from "use-immer";
import TextInput from "../fragments/TextInput";

function createEmptyItem(): TextItemConfig {
  return {
    id: dayjs().valueOf() + 1,
    text: "",
    typo: {
      ...DefaultTextTypo,
    },
  };
}

function createEmptyLine(): LineConfig {
  return {
    item: [createEmptyItem()],
  };
}

function TextList({
  config,
  lineIndex,
  updateTitleConfig,
  updateTextItem,
  currentTextItem,
}: {
  config: LineConfig;
  lineIndex: number;
  updateTitleConfig: Updater<TitleConfig>;
  updateTextItem: Updater<TextItemConfig | null>;
  currentTextItem: TextItemConfig | null;
}) {
  const addItem = () => {
    updateTitleConfig((draft) => {
      draft.line.forEach((value, index) => {
        if (index === lineIndex) {
          value.item.push(createEmptyItem());
        }
      });
    });
  };

  const deleteItem = (value: TextItemConfig) => {
    updateTitleConfig((draft) => {
      draft.line.forEach((line) => {
        line.item = line.item.filter((item) => {
          return item.id !== value.id;
        });
      });
    });
    updateTextItem(null);
  };

  return (
    <div className="grid grid-cols-[1fr_auto]">
      <div className="flex flex-row gap-1 overflow-x-auto whitespace-nowrap">
        {config.item.map((value) => {
          return (
            <TextBtn
              onDoubleClick={() => {
                deleteItem(value);
              }}
              onClick={() => {
                updateTextItem(value);
              }}
              toggled={currentTextItem?.id === value.id}
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

function TextViewer({
  config,
  updateTitleConfig,
  updateTextItem,
  currentTextItem,
}: {
  config: TitleConfig;
  updateTitleConfig: Updater<TitleConfig>;
  updateTextItem: Updater<TextItemConfig | null>;
  currentTextItem: TextItemConfig | null;
}) {
  return (
    <div>
      <div className="grid-cols grid gap-2">
        {config.line.map((value, index) => {
          return (
            <TextList
              key={index}
              lineIndex={index}
              config={value}
              updateTitleConfig={updateTitleConfig}
              updateTextItem={updateTextItem}
              currentTextItem={currentTextItem}
            />
          );
        })}
        <Btn
          onClick={() => {
            updateTitleConfig((draft) => {
              draft.line.push(createEmptyLine());
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

function TextEditor({
  textItem,
  updateTextItem,
}: {
  textItem: TextItemConfig | null;
  updateTextItem: Updater<TextItemConfig | null>;
}) {
  const labelClassName = "font-monospace pr-1";
  const inputClassName =
    "min-w-0 border-none bg-zinc-50 pl-1 text-zinc-950 outline-none";

  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-1">
        <TextInput
          disabled={!textItem}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            updateTextItem((draft) => {
              if (draft) draft.text = event.target.value;
            });
          }}
          value={textItem ? textItem.text : ""}
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

export default function SvgViewer({
  month,
  date,
  isAdmin,
}: {
  month: number;
  date: number;
  isAdmin: boolean;
}) {
  const [accentColor, setAccentColor] = useState<string>("#000000");
  const [titleConfig, updateTitleConfig] = useImmer<TitleConfig>({
    ...DefaultTitleConfig,
    line: [createEmptyLine()],
  });
  const [textItem, updateTextItem] = useImmer<TextItemConfig | null>(null);

  useEffect(() => {
    if (!textItem) return;
    updateTitleConfig((draft) => {
      for (const line of draft.line) {
        line.item.forEach((value) => {
          if (value.id === textItem.id) {
            value.text = textItem.text;
            value.typo = textItem.typo;
          }
        });
      }
    });
  }, [textItem]);

  useEffect(() => {
    updateTitleConfig((draft) => {
      const hasEmptyLine = draft.line.some((value) => {
        return value.item.length === 0;
      });

      if (hasEmptyLine) {
        draft.line = draft.line.filter((value) => {
          return value.item.length !== 0;
        });
      }
    });
  }, [titleConfig]);

  return (
    <>
      <div className="grid h-full overflow-auto p-5">
        <div className="m-auto flex content-center justify-center">
          <CalendarSvg
            month={month}
            date={date}
            accentColor={accentColor}
            titleConfig={titleConfig}
          />
        </div>
        {isAdmin && (
          <div className="grid w-full gap-1 py-1">
            <div className="flex flex-col gap-1">
              <label htmlFor="">제목</label>
              <div className="grid grid-cols-2 gap-4">
                <TextViewer
                  config={titleConfig}
                  updateTitleConfig={updateTitleConfig}
                  updateTextItem={updateTextItem}
                  currentTextItem={textItem}
                />
                <TextEditor
                  textItem={textItem}
                  updateTextItem={updateTextItem}
                />
              </div>
            </div>

            <Colorful
              color={accentColor}
              disableAlpha={true}
              onChange={(color) => {
                setAccentColor(color.hex);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
