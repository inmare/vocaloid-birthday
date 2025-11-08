import type { DataConfig } from "@components/type";
import { createContext } from "react";

export const TextEditContext = createContext<DataConfig>({} as DataConfig);
