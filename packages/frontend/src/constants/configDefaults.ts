import type { FragemntConfig, TextConfig } from "@/components/type";
import SvgDefault from "@/constants/svgDefaults";

const TitleDefault = {
  fontSize: SvgDefault.titleFontSize,
  lineHeight: 1,
  items: [] as unknown[][],
} as TextConfig;

const ComposerDefault = {
  fontSize: SvgDefault.composerFontSize,
  lineHeight: 1,
  items: [] as unknown[][],
} as TextConfig;

const FragmentDefault = {
  accentColor: SvgDefault.accentColor,
  lyrics: "",
  titleKor: "",
  composerKor: "",
  imageX: SvgDefault.imageX,
  imageY: SvgDefault.imageY,
  imageScale: SvgDefault.imageScale,
} as FragemntConfig;

export { ComposerDefault, FragmentDefault, TitleDefault };
