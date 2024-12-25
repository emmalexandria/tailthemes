import { type PluginAPI, type Config } from "tailwindcss/types/config";
import plugin from "tailwindcss/plugin";
import { parseTailthemesConfig } from "./config";

const scheme = Symbol('color-scheme');
export type TailwindTheme = Config["theme"]

export interface InternalConfig<T extends Config["theme"]> {
	[key: string]: T
}

const defaultProduceCssVariables = (name: string, key?: string) => {
	if (key) {
		return `--tailthemes-${key}-${name}`
	}
	return `--tailthemes-${name}`
}

const defaultProduceClassNames = (name: string) => {
	return name
}

interface MediaQueryThemes {
	dark?: string
	light?: string
	highContrast?: string
}

export type DefaultTheme = string | MediaQueryThemes

export interface TailthemesOptions {
	defaultTheme?: DefaultTheme
}

export const tailthemes = <T extends Config["theme"]>(config: InternalConfig<T>, options?: TailthemesOptions) => {
	const parsedConfig = parseTailthemesConfig(config, options)

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



