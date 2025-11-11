import api from "@/api";
import { DEV_API_ENDPOINT } from "@/constants";
import {
  ComposerDefault,
  FragmentDefault,
  TitleDefault,
} from "@/constants/configDefaults";
import SvgDefault from "@/constants/svgDefaults";
import { MainSvg } from "@components/svg";
import { SvgContext } from "@components/SvgContext";
import {
  ImageInput,
  TextAllEditor,
  TextEditor,
  TextViewer,
} from "@components/svgEditor";
import { TextEditContext } from "@components/TextEditContext";
import type { SvgConfig, VisibilityState } from "@components/type";
import { Button, Input, Label, Textarea, TextInput } from "@components/ui";
import { getTextFromItems, imageToBase64 } from "@components/utils";
import Colorful from "@uiw/react-color-colorful";
import type {
  CalendarAttributes,
  CalendarPostAttributes,
} from "@vocaloid-birthday/common";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { "v4" as uuidv4 } from "uuid";
dayjs.extend(utc);

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

  // svg 데이터를 서버로 전송하는 함수
  const sendSvgData = async () => {
    if (!svgRef.current) return;
    if (!isAdmin) return;
    if (songId === null) return alert("곡 ID를 입력해주세요.");

    const formData = new FormData();
    const fileId = uuidv4();

    // 현재 svg 요소를 복사해서 불필요한 속성 제거
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    // 클래스 속성 제거
    svgClone.removeAttribute("class");

    // svg의 이미지를 로컬 링크로 설정
    const embedImageLink = fragment.imageLink
      ? await imageToBase64(fragment.imageLink)
      : null;
    const imageElement = svgClone.getElementById(SvgDefault.imageId);
    if (embedImageLink) {
      imageElement?.setAttribute("xlink:href", embedImageLink);
    }

    if (fragment.imageLink && fragment.imageLink.startsWith("blob:")) {
      const res = await fetch(fragment.imageLink);
      const blob = await res.blob();
      const ext = blob.type.split("/")[1];
      const file = new File([blob], `${fileId}-image.${ext}`, {
        type: blob.type,
      });
      formData.append("imageFile", file);
    }

    // 백엔드로 보낼 fragment 객체에서는 이미지 링크 제거
    const filteredFragment = { ...fragment };
    filteredFragment.imageLink = null;

    // 가이드라인 요소 제거
    const guideElement = svgClone.getElementById(SvgDefault.guideId);
    guideElement?.remove();

    // FormData에 svg 파일 추가
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], {
      type: "image/svg+xml",
    });
    const svgFile = new File([blob], `${fileId}-svg.svg`, {
      type: "image/svg+xml",
    });
    formData.append("svgFile", svgFile);

    // 데이터베이스에 보낼 객체 설정
    const data = {
      songId: songId,
      calendarDate: dayjs.utc(`2026-${month}-${date}`).toDate(),
      svgConfig: {
        title,
        composer,
        fragment: filteredFragment,
      } as object,
    } as CalendarPostAttributes;

    // 제목, 작곡가, 한국어 제목/작곡가, 가사 데이터 설정
    const titleText = getTextFromItems(title.items);
    const composerText = getTextFromItems(composer.items);

    // 데이터가 존재할 때만 설정
    if (titleText) data.title = titleText;
    if (composerText) data.composer = composerText;
    if (fragment.titleKor !== "") data.titleKor = fragment.titleKor;
    if (fragment.composerKor !== "") data.composerKor = fragment.composerKor;
    if (fragment.lyrics !== "") data.lyrics = fragment.lyrics;

    formData.append("data", JSON.stringify(data));

    try {
      const res = await api.post("/api/admin/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 데이터를 보낸 다음에 한번 fetchProgress를 호출해서 진행 상황을 갱신
      await fetchProgress();
      if (res.status === 200) {
        alert("SVG 데이터가 성공적으로 저장되었습니다.");
      } else {
        alert("SVG 데이터 저장에 실패했습니다.");
        console.error(res.status, res.data);
      }
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
            ? `${DEV_API_ENDPOINT}/static/${data.imageFileName}`
            : null;
          updateFragment(fragment);
          setSongId(data.songId);
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
          <MainSvg svgRef={svgRef} month={month} date={date} />
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
                  step={0.5}
                  value={fragment.imageX}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    updateFragment((draft) => {
                      draft.imageX = parseFloat(event.target.value);
                    });
                  }}
                />
                <Input
                  type="number"
                  step={0.5}
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
                  <TextAllEditor />
                  <TextViewer />
                  <TextEditor />
                </TextEditContext.Provider>
              </div>
              <label htmlFor="">제목</label>
              <div className="grid grid-cols-2 gap-4">
                <TextEditContext.Provider value={titleValue}>
                  <TextAllEditor />
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
                    if (prevLink?.startsWith("blob:") && prevLink !== link) {
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
