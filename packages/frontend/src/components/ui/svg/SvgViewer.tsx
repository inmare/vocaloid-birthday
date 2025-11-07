import api from "@/api";
import { SvgContext } from "@components/SvgContext";
import { TextEditContext } from "@components/TextEditContext";
import type { VisibilityState } from "@components/type";
import Btn from "@components/ui/fragments/Btn";
import CustomTextarea from "@components/ui/fragments/CustomTextarea";
import CustomTextInput from "@components/ui/fragments/CustomTextInput";
import SvgCalendar from "@components/ui/svg/SvgCalendar";
import TextEditor from "@components/ui/svg/TextEditor";
import TextViewer from "@components/ui/svg/TextViewer";
import Colorful from "@uiw/react-color-colorful";
import clsx from "clsx";
import dayjs from "dayjs";
import { useContext, useMemo, useRef, useState, type ChangeEvent } from "react";

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

  const sendSvgData = async () => {
    const mockupData = {
      title: "Title",
      composer: "Composer",
      titleKor: "타이틀",
      composerKor: "작곡가",
      publishDate: dayjs().toDate(),
      calendarDate: dayjs(`2026-${month}-${date + 1}`).toDate(),
      lyrics: "Lyrics",
      svgConfig: {
        accentColor,
      },
      svgData: "<svg></svg>",
      songId: 1,
    };
    const res = await api.post("/api/admin/save-data", {
      data: mockupData,
    });
    console.log(res.status, res.data);
  };

  const config = useContext(SvgContext);

  const titleValue = useMemo(
    () => ({
      data: config.title,
      updateData: config.updateTitle,
    }),
    [config.title, config.updateTitle],
  );

  const composerValue = useMemo(
    () => ({
      data: config.composer,
      updateData: config.updateComposer,
    }),
    [config.composer, config.updateComposer],
  );

  const [paletteVisible, setPaletteVisible] = useState<VisibilityState>("hide");
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
  };

  const inputClassName =
    "min-w-0 border-none bg-zinc-50 pl-1 text-zinc-950 outline-none";

  return (
    <>
      <div className="mx-auto grid max-w-xl p-5">
        <div className="flex scale-100 items-center justify-center">
          <SvgCalendar month={month} date={date} accentColor={accentColor} />
        </div>
        {isAdmin && (
          <div className="grid w-full gap-1 py-1">
            <div className="flex flex-col gap-1">
              <label htmlFor="">곡 id</label>
              <CustomTextInput />
              <label htmlFor="">테마 색</label>
              <div className="flex flex-row gap-2">
                <div className="relative h-8 w-8">
                  <div
                    className="aspect-square w-8 rounded-full border-2 border-zinc-100"
                    style={{ backgroundColor: accentColor }}
                    onClick={() => {
                      if (paletteVisible === "show") setPaletteVisible("hide");
                      else if (paletteVisible === "hide")
                        setPaletteVisible("show");
                    }}
                  ></div>
                  <Colorful
                    className={clsx(
                      "absolute inset-0 top-2 shadow-2xl transition-all duration-100 ease-in-out",
                      {
                        ["opacity-100"]: paletteVisible === "show",
                        ["pointer-events-none opacity-0"]:
                          paletteVisible === "hide",
                      },
                    )}
                    color={accentColor}
                    disableAlpha={true}
                    onChange={(color) => {
                      setAccentColor(color.hex);
                    }}
                  />
                </div>
                <CustomTextInput
                  value={accentColor}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setAccentColor(event.target.value);
                  }}
                  className="font-monospace w-21"
                />
              </div>

              <label htmlFor="">이미지 위치</label>
              <div className="grid grid-cols-3 gap-1">
                <label className="font-monospace" htmlFor="image-x">
                  x
                </label>
                <label className="font-monospace" htmlFor="image-y">
                  y
                </label>
                <label className="font-monospace" htmlFor="image-scale">
                  scale
                </label>
                <input
                  className={inputClassName}
                  name="image-x"
                  type="number"
                  step={0.1}
                />
                <input
                  className={inputClassName}
                  name="image-y"
                  type="number"
                  step={0.1}
                />
                <input
                  className={inputClassName}
                  name="image-scale"
                  type="number"
                  step={0.1}
                />
              </div>
              <label htmlFor="">작곡가</label>
              <div className="grid grid-cols-2 gap-4">
                <TextEditContext.Provider value={composerValue}>
                  <TextViewer />
                  <TextEditor />
                </TextEditContext.Provider>
              </div>
              <label htmlFor="">제목</label>
              <div className="grid grid-cols-2 gap-4">
                <TextEditContext.Provider value={titleValue}>
                  <TextViewer />
                  <TextEditor />
                </TextEditContext.Provider>
              </div>
              <label htmlFor="">가사</label>
              <CustomTextarea />
              <label htmlFor="">제목(한국어)</label>
              <CustomTextarea />
              <label htmlFor="">작곡가(한국어)</label>
              <CustomTextarea />
              <label htmlFor="">이미지</label>
              <Btn
                className="self-start rounded-md px-2 py-1"
                onClick={() => {
                  if (inputFileRef) inputFileRef.current?.click();
                }}
              >
                선택하기
                <input
                  ref={inputFileRef}
                  onChange={onFileChange}
                  type="file"
                  className="hidden"
                />
              </Btn>
            </div>

            <Btn onClick={sendSvgData}>저장하기</Btn>
          </div>
        )}
      </div>
    </>
  );
}
