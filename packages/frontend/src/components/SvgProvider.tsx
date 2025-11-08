import {
  ComposerDefault,
  FragmentDefault,
  TitleDefault,
} from "@/constants/configDefaults";
import { useMemo, type ReactNode } from "react";
import { useImmer } from "use-immer";
import { SvgContext } from "./SvgContext";
import type { FragemntConfig, TextConfig } from "./type";

export function SvgProvider({ children }: { children: ReactNode }) {
  // 기본 설정들로 초기화
  const [titleConfig, updateTitleConfig] = useImmer<TextConfig>(TitleDefault);
  const [composerConfig, updateComposerConfig] =
    useImmer<TextConfig>(ComposerDefault);
  const [fragmentConfig, updateFragmentConfig] =
    useImmer<FragemntConfig>(FragmentDefault);

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
