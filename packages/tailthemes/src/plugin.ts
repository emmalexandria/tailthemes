import { type PluginAPI, type Config } from "tailwindcss/types/config";
import plugin from "tailwindcss/plugin";
import { defaultOptions, parseTailthemesConfig } from "./config";

const scheme = Symbol('color-scheme');
export type TailwindTheme = Config["theme"]

export type ColorSchemes = "dark" | "light" | "high-contrast" | "default"

export interface InternalConfig<T extends Config["theme"]> {
	[key: string]: T & {
		colorScheme?: ColorSchemes
	}

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

export type CSSVariableGenerator = (name: string, key?: string) => string
export type ClassGenerator = (name: string) => string

export interface TailthemesOptions {
	cssGenerator: CSSVariableGenerator,
	classGenerator: ClassGenerator,
}

export const tailthemes = <T extends Config["theme"]>(config: InternalConfig<T>, options?: Partial<TailthemesOptions>) => {
	let fullOptions: TailthemesOptions;

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



