import { SvgComposerFontSize, SvgTitleFontSize } from "@/constants/svgConfig";
import { useMemo, type ReactNode } from "react";
import { useImmer } from "use-immer";
import { SvgContext } from "./SvgContext";
import type { TextConfig, TextItem } from "./type";

export function SvgProvider({ children }: { children: ReactNode }) {
  const [titleConfig, updateTitleConfig] = useImmer<TextConfig>({
    fontSize: SvgTitleFontSize,
    lineHeight: 1,
    items: [] as TextItem[][],
  });
  const [composerConfig, updateComposerConfig] = useImmer<TextConfig>({
    fontSize: SvgComposerFontSize,
    lineHeight: 1,
    items: [] as TextItem[][],
  });

  const value = useMemo(
    () => ({
      title: titleConfig,
      composer: composerConfig,
      updateTitle: updateTitleConfig,
      updateComposer: updateComposerConfig,
    }),
    [titleConfig, composerConfig, updateTitleConfig, updateComposerConfig],
  );

  return <SvgContext.Provider value={value}>{children}</SvgContext.Provider>;
}
