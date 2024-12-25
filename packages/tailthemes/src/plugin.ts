import { type PluginAPI, type Config } from "tailwindcss/types/config";
import plugin from "tailwindcss/plugin";
import { parseTailthemesConfig } from "./config";

const scheme = Symbol('color-scheme');
export type TailwindTheme = Config["theme"]

export interface InternalConfig<T extends Config["theme"]> {
	[key: string]: T
}

export const tailthemes = <T extends Config["theme"]>(config: InternalConfig<T>) => {
	const parsedConfig = parseTailthemesConfig(config)

	return plugin(
		({ addUtilities, addVariant, addBase, addComponents, e, config }) => {
			parsedConfig.variants.forEach(({ name, definition }) => addVariant(name, definition));
			addUtilities(parsedConfig.utilities);
		},
		{
			theme: {
				extend: parsedConfig.theme
			}
		}
	)
}



