import { createContext } from "react";
import type { DataConfig } from "./type";

export const TextEditContext = createContext<DataConfig>({} as DataConfig);
