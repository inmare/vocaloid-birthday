import type { SvgConfig } from "@components/type";
import { createContext } from "react";

export const SvgContext = createContext<SvgConfig>({} as SvgConfig);
