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
import { useContext, useMemo, useState, type ChangeEvent } from "react";
import CutstomLabel from "../fragments/CustomLabel";
import CustomNumberInput from "../fragments/CustomNumberInput";
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
  const sendSvgData = async () => {
    const mockupData = {
      title: "Title",
      composer: "Composer",
      titleKor: "타이틀",
      composerKor: "작곡가",
      publishDate: dayjs().toDate(),
      calendarDate: dayjs(`2026-${month}-${date + 1}`).toDate(),
      lyrics: "Lyrics",
      svgConfig: {},
      svgData: "<svg></svg>",
      songId: 1,
    };
    const res = await api.post("/api/admin/save-data", {
      data: mockupData,
    });
    console.log(res.status, res.data);
  };

  const {
    title,
    updateTitle,
    composer,
    updateComposer,
    fragment,
    updateFragment,
  } = useContext(SvgContext);

  const titleValue = useMemo(
    () => ({
      data: title,
      updateData: updateTitle,
    }),
    [title, updateTitle],
  );

  const composerValue = useMemo(
    () => ({
      data: composer,
      updateData: updateComposer,
    }),
    [composer, updateComposer],
  );

  const [paletteVisible, setPaletteVisible] = useState<VisibilityState>("hide");

  return (
    <>
      <div className="mx-auto grid max-w-xl p-5">
        <div className="flex scale-100 items-center justify-center">
          <SvgCalendar month={month} date={date} />
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
                    style={{ backgroundColor: fragment.accentColor }}
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
                    color={fragment.accentColor}
                    disableAlpha={true}
                    onChange={(color) => {
                      updateFragment((draft) => {
                        draft.accentColor = color.hex;
                      });
                    }}
                  />
                </div>
                <CustomTextInput
                  value={fragment.accentColor}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    updateFragment((draft) => {
                      draft.accentColor = event.target.value;
                    });
                  }}
                  className="font-monospace w-21"
                />
              </div>

              <label htmlFor="">이미지 위치</label>
              <div className="grid grid-cols-3 gap-1">
                <CutstomLabel>x</CutstomLabel>
                <CutstomLabel>y</CutstomLabel>
                <CutstomLabel>scale</CutstomLabel>
                <CustomNumberInput
                  type="number"
                  step={0.1}
                  value={fragment.imageX}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    updateFragment((draft) => {
                      draft.imageX = parseFloat(event.target.value);
                    });
                  }}
                />
                <CustomNumberInput
                  type="number"
                  step={0.1}
                  value={fragment.imageY}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    updateFragment((draft) => {
                      draft.imageY = parseFloat(event.target.value);
                    });
                  }}
                />
                <CustomNumberInput
                  type="number"
                  step={0.01}
                  value={fragment.imageScale}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    updateFragment((draft) => {
                      draft.imageScale = parseFloat(event.target.value);
                    });
                  }}
                />
              </div>
              <label htmlFor="">작곡가</label>
              <div className="grid grid-cols-2 gap-4">
                <TextEditContext.Provider value={composerValue}>
                  <TextAllEditor fontSize={composer.fontSize} lineHeight={1} />
                  <TextViewer />
                  <TextEditor />
                </TextEditContext.Provider>
              </div>
              <label htmlFor="">제목</label>
              <div className="grid grid-cols-2 gap-4">
                <TextEditContext.Provider value={titleValue}>
                  <TextAllEditor
                    fontSize={title.fontSize}
                    lineHeight={title.lineHeight}
                  />
                  <TextViewer />
                  <TextEditor />
                </TextEditContext.Provider>
              </div>
              <label htmlFor="">가사</label>
              <CustomTextarea
                value={fragment.lyrics}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  updateFragment((draft) => {
                    draft.lyrics = event.target.value;
                  });
                }}
              />
              <label htmlFor="">제목(한국어)</label>
              <CustomTextarea
                value={fragment.titleKor}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  updateFragment((draft) => {
                    draft.titleKor = event.target.value;
                  });
                }}
              />
              <label htmlFor="">작곡가(한국어)</label>
              <CustomTextarea
                value={fragment.composerKor}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  updateFragment((draft) => {
                    draft.composerKor = event.target.value;
                  });
                }}
              />
              <label htmlFor="">이미지</label>
              <ImageInput
                setImageBase64={(base64: string) => {
                  updateFragment((draft) => {
                    draft.imageBase64 = base64;
                  });
                }}
              />
            </div>

            <Btn onClick={sendSvgData}>저장하기</Btn>
          </div>
        )}
      </div>
    </>
  );
}
