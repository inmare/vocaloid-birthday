import SvgDefault from "@/constants/svgConfig";
import { useMemo, type ReactNode } from "react";
import { useImmer } from "use-immer";
import { SvgContext } from "./SvgContext";
import type { FragemntConfig, TextConfig, TextItem } from "./type";

export function SvgProvider({ children }: { children: ReactNode }) {
  // 기본 설정들로 초기화
  const [titleConfig, updateTitleConfig] = useImmer<TextConfig>({
    fontSize: SvgDefault.titleFontSize,
    lineHeight: 1,
    items: [] as TextItem[][],
  });
  const [composerConfig, updateComposerConfig] = useImmer<TextConfig>({
    fontSize: SvgDefault.composerFontSize,
    lineHeight: 1,
    items: [] as TextItem[][],
  });
  const [fragmentConfig, updateFragmentConfig] = useImmer<FragemntConfig>({
    accentColor: SvgDefault.accentColor,
    lyrics: "",
    titleKor: "",
    composerKor: "",
    imageX: SvgDefault.imageX,
    imageY: SvgDefault.imageY,
    imageScale: SvgDefault.imageScale,
  });

  const value = useMemo(
    () => ({
      title: titleConfig,
      composer: composerConfig,
      fragment: fragmentConfig,
      updateTitle: updateTitleConfig,
      updateComposer: updateComposerConfig,
      updateFragment: updateFragmentConfig,
    }),
    [
      titleConfig,
      composerConfig,
      fragmentConfig,
      updateTitleConfig,
      updateComposerConfig,
      updateFragmentConfig,
    ],
  );

  return <SvgContext.Provider value={value}>{children}</SvgContext.Provider>;
}
