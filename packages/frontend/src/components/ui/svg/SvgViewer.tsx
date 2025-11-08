import api from "@/api";
import { SvgComposerFontSize, SvgTitleFontSize } from "@/constants/svgConfig";
import { SvgContext } from "@components/SvgContext";
import { TextEditContext } from "@components/TextEditContext";
import type { ImageConfig, VisibilityState } from "@components/type";
import Btn from "@components/ui/fragments/Btn";
import CustomTextarea from "@components/ui/fragments/CustomTextarea";
import CustomTextInput from "@components/ui/fragments/CustomTextInput";
import SvgCalendar from "@components/ui/svg/SvgCalendar";
import TextEditor from "@components/ui/svg/TextEditor";
import TextViewer from "@components/ui/svg/TextViewer";
import Colorful from "@uiw/react-color-colorful";
import clsx from "clsx";
import dayjs from "dayjs";
import { useContext, useMemo, useState, type ChangeEvent } from "react";
import ImageInput from "./ImageInput";
import TextAllEditor from "./TextAllEditor";

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

  const inputClassName =
    "min-w-0 border-none bg-zinc-50 pl-1 text-zinc-950 outline-none";

  const [lyrics, setLyrics] = useState<string>("");
  const [titleKor, setTitleKor] = useState<string>("");
  const [composerKor, setComposerKor] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePos, setImagePos] = useState<ImageConfig>({
    x: 0,
    y: 0,
    scale: 4.5 / 100,
  });

  return (
    <>
      <div className="mx-auto grid max-w-xl p-5">
        <div className="flex scale-100 items-center justify-center">
          <SvgCalendar
            {...{
              month,
              date,
              accentColor,
              lyrics,
              titleKor,
              composerKor,
              imageBase64,
              imagePos,
            }}
          />
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
                  value={imagePos.x}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setImagePos({
                      ...imagePos,
                      x: parseFloat(event.target.value),
                    });
                  }}
                />
                <input
                  className={inputClassName}
                  name="image-y"
                  type="number"
                  step={0.1}
                  value={imagePos.y}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setImagePos({
                      ...imagePos,
                      y: parseFloat(event.target.value),
                    });
                  }}
                />
                <input
                  className={inputClassName}
                  name="image-scale"
                  type="number"
                  step={0.1}
                  value={imagePos.scale}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setImagePos({
                      ...imagePos,
                      scale: parseFloat(event.target.value),
                    });
                  }}
                />
              </div>
              <label htmlFor="">작곡가</label>
              <div className="grid grid-cols-2 gap-4">
                <TextEditContext.Provider value={composerValue}>
                  <TextAllEditor fontSize={SvgTitleFontSize} lineHeight={1} />
                  <TextViewer />
                  <TextEditor />
                </TextEditContext.Provider>
              </div>
              <label htmlFor="">제목</label>
              <div className="grid grid-cols-2 gap-4">
                <TextEditContext.Provider value={titleValue}>
                  <TextAllEditor
                    fontSize={SvgComposerFontSize}
                    lineHeight={1}
                  />
                  <TextViewer />
                  <TextEditor />
                </TextEditContext.Provider>
              </div>
              <label htmlFor="">가사</label>
              <CustomTextarea
                value={lyrics}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setLyrics(event.target.value);
                }}
              />
              <label htmlFor="">제목(한국어)</label>
              <CustomTextarea
                value={titleKor}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setTitleKor(event.target.value);
                }}
              />
              <label htmlFor="">작곡가(한국어)</label>
              <CustomTextarea
                value={composerKor}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setComposerKor(event.target.value);
                }}
              />
              <label htmlFor="">이미지</label>
              <ImageInput {...{ setImageBase64 }} />
            </div>

            <Btn onClick={sendSvgData}>저장하기</Btn>
          </div>
        )}
      </div>
    </>
  );
}
