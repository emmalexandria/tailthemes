import { Config } from "tailwindcss";
import { InternalConfig, tailthemes, TailwindTheme } from "./plugin";

export type TailthemesConfig = InternalConfig<TailwindTheme>
export type TailthemesSchema = Required<Config>["theme"]
export { tailthemes }


