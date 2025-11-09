import api from "@/api";
import Button from "@/components/ui/fragments/Button";
import Input from "@/components/ui/fragments/Input";
import Label from "@/components/ui/fragments/Label";
import Textarea from "@/components/ui/fragments/Textarea";
import TextInput from "@/components/ui/fragments/TextInput";
import {
  ComposerDefault,
  FragmentDefault,
  TitleDefault,
} from "@/constants/configDefaults";
import { SvgContext } from "@components/SvgContext";
import { TextEditContext } from "@components/TextEditContext";
import type { SvgConfig, TextItem, VisibilityState } from "@components/type";
import ImageInput from "@components/ui/svg/ImageInput";
import SvgCalendar from "@components/ui/svg/SvgCalendar";
import TextAllEditor from "@components/ui/svg/TextAllEditor";
import TextEditor from "@components/ui/svg/TextEditor";
import TextViewer from "@components/ui/svg/TextViewer";
import Colorful from "@uiw/react-color-colorful";
import type { CalendarAttributes } from "@vocaloid-birthday/common";
import clsx from "clsx";
import dayjs from "dayjs";
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { "v4" as uuidv4 } from "uuid";

export default function SvgViewer({
  month,
  date,
  isAdmin,
  fetchProgress,
}: {
  month: number;
  date: number;
  isAdmin: boolean;
  fetchProgress: () => Promise<void>;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

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

  const [songId, setSongId] = useState<number | null>(null);

  const getTextFromItems = (itemMatrix: TextItem[][]): string => {
    let result = "";
    itemMatrix.forEach((line) => {
      line.forEach((item) => {
        result += item.text;
      });
      result += "\n";
    });
    return result;
  };

  // TODO: svg의 이미지 링크도 로컬 형식으로 바꾸기
  const sendSvgData = async () => {
    if (!svgRef.current) return;
    if (!isAdmin) return;
    if (songId === null) return alert("곡 ID를 입력해주세요.");

    const formData = new FormData();

    const filteredFragment = { ...fragment };
    if (
      filteredFragment.imageLink &&
      filteredFragment.imageLink.startsWith("blob:")
    ) {
      const imageLink = filteredFragment.imageLink;
      const res = await fetch(imageLink);
      const blob = await res.blob();
      const ext = blob.type.split("/")[1] || "png";
      const imageFile = new File([blob], `${uuidv4()}.${ext}`, {
        type: blob.type,
      });

      formData.append("imageFile", imageFile);
      filteredFragment.imageLink = null;
    }

    const data = {
      title: getTextFromItems(title.items),
      composer: getTextFromItems(composer.items),
      titleKor: fragment.titleKor,
      composerKor: fragment.composerKor,
      calendarDate: dayjs(`2026-${month}-${date + 1}`).toDate(),
      lyrics: fragment.lyrics,
      svgConfig: {
        title,
        composer,
        fragment: filteredFragment,
      },
      svgData: svgRef.current.outerHTML,
      songId: songId,
    };

    // 현재 svg 요소를 복사해서 불필요한 속성 제거
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgClone.classList = "";
    const svgString = svgClone.outerHTML;

    const blob = new Blob([svgString], {
      type: "image/svg+xml",
    });
    const svgFile = new File([blob], `${uuidv4()}.svg`, {
      type: "image/svg+xml",
    });

    formData.append("svgFile", svgFile);
    formData.append("data", JSON.stringify(data));

    try {
      const res = await api.post("/api/admin/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProgress();
      console.log(res.status, res.data);
    } catch (error) {
      console.error("SVG 데이터 전송 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        const response = await api.get("/api/calendar", {
          params: { month, date },
        });
        const data = response.data as CalendarAttributes | null;
        if (data === null) {
          updateTitle(TitleDefault);
          updateComposer(ComposerDefault);
          updateFragment(FragmentDefault);
        } else {
          const svgConfig = data.svgConfig as SvgConfig;
          updateTitle(svgConfig.title);
          updateComposer(svgConfig.composer);
          const fragment = svgConfig.fragment;
          fragment.imageLink = data.imageFileName
            ? `/static/${data.imageFileName}`
            : null;
          updateFragment(fragment);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getCalendarData();
  }, [month, date, updateTitle, updateComposer, updateFragment]);

  return (
    <>
      <div className="mx-auto grid max-w-xl p-5">
        <div className="flex scale-100 items-center justify-center">
          <SvgCalendar svgRef={svgRef} month={month} date={date} />
        </div>
        {isAdmin && (
          <div className="grid w-full gap-1 py-1">
            <div className="flex flex-col gap-1">
              <label htmlFor="">곡 id</label>
              <TextInput
                value={songId === null ? "" : songId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const intValue = parseInt(event.target.value);
                  if (isNaN(intValue)) {
                    setSongId(null);
                  } else {
                    setSongId(intValue);
                  }
                }}
              />
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
                <TextInput
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
                <Label>x</Label>
                <Label>y</Label>
                <Label>scale</Label>
                <Input
                  type="number"
                  step={0.1}
                  value={fragment.imageX}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    updateFragment((draft) => {
                      draft.imageX = parseFloat(event.target.value);
                    });
                  }}
                />
                <Input
                  type="number"
                  step={0.1}
                  value={fragment.imageY}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    updateFragment((draft) => {
                      draft.imageY = parseFloat(event.target.value);
                    });
                  }}
                />
                <Input
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
              <Textarea
                value={fragment.lyrics}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  updateFragment((draft) => {
                    draft.lyrics = event.target.value;
                  });
                }}
              />
              <label htmlFor="">제목(한국어)</label>
              <Textarea
                value={fragment.titleKor}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  updateFragment((draft) => {
                    draft.titleKor = event.target.value;
                  });
                }}
              />
              <label htmlFor="">작곡가(한국어)</label>
              <Textarea
                value={fragment.composerKor}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  updateFragment((draft) => {
                    draft.composerKor = event.target.value;
                  });
                }}
              />
              <label htmlFor="">이미지</label>
              <ImageInput
                setImageLink={(link: string) => {
                  updateFragment((draft) => {
                    const prevLink = draft.imageLink;
                    // 이전에 blob 형식의 링크였으면 해제
                    if (prevLink?.startsWith("blob:")) {
                      URL.revokeObjectURL(prevLink);
                    }
                    draft.imageLink = link;
                  });
                }}
              />
            </div>

            <Button onClick={sendSvgData}>저장하기</Button>
          </div>
        )}
      </div>
    </>
  );
}
