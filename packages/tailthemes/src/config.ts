import { Config } from "tailwindcss";
import { InternalConfig, TailthemesOptions, type TailwindTheme, type CSSVariableGenerator, type ClassGenerator, ColorSchemes } from "./plugin"
import Color from "color"

type ParsedConfig = {
	variants: Variants,
	utilities: Utilities,
	theme: TailwindTheme
}

type Variants = Array<{ name: string; definition: string[] }>;
type Utilities = { [selector: string]: Record<string, any> }

const defaultCssGenerator: CSSVariableGenerator = (name, key) => {
	if (key) {
		return `--tailthemes-${key}-${name}`
	}

	return `--tailthemes-${name}`
}

const defaultClassGenerator: ClassGenerator = (name: string) => {
	return name
}

export const defaultOptions: TailthemesOptions = {
	cssGenerator: defaultCssGenerator,
	classGenerator: defaultClassGenerator
}

export function flattenSubTheme(theme: TailwindTheme): { [key: string]: any } {
	let flattened: { [key: string]: any } = {};

	for (const field in theme) {
		const fieldVal = theme[field]
		const flattenedField = flattenObject(fieldVal)
		flattened[field] = flattenedField
	}
	return flattened
}


export function flattenObject(theme: { [key: string]: string }): { [key: string]: string } {
	const flattened: { [key: string]: string } = {}
	for (const field in theme) {
		if (typeof theme[field] === "object") {
			!Array.isArray(field)

			const tempObj = flattenObject(theme[field])

			for (const subField in tempObj) {
				flattened[field + '-' + subField] = tempObj[subField]
			}
		} else {
			flattened[field] = theme[field]
		}
	}
	Object.keys(flattened).forEach((k: any) => {
		const val = flattened[k]
		if (typeof val === "string") {
			flattened[k] = val.replace(/\-DEFAULT$/, '')
		}
	})

	return flattened
}



const generateVariants = (selector: string): string[] => {
	return [
		`${selector}&`,
		`:is(${selector} > &:not([data-theme]))`,
		`:is(${selector} &:not(${selector} [data-theme]:not(${selector}) * ))`,
		`:is(${selector}:not(:has([data-theme])) &:not([data-theme]))`,
	];
}

const generateRootVariants = (scheme: ColorSchemes | undefined): string[] => {
	if (!scheme) {
		return []
	}
	const baseDefs = [
		`:root&`,
		`:is(:root > &:not([data-theme]))`,
		`:is(:root &:not([data-theme] *):not([data-theme])`
	]
	if (scheme === "default") {
		return baseDefs
	}
	if (scheme === "high-contrast") {
		return baseDefs.map((d) => `@media (prefers-contrast: more){${d}}`)
	}
	if (scheme === "light") {
		return baseDefs.map((d) => `@media (prefers-color-scheme: light){${d}}`)
	}
	if (scheme === "dark") {
		return baseDefs.map((d) => `@media (prefers-color-scheme: dark){${d}}`)
	}
	return []
}

const addRootUtility = (utilities: Utilities, scheme: ColorSchemes, key: string, value: string) => {
	if (scheme === 'default') {
		if (!utilities[':root']) {
			utilities[':root'] = {}
		}
		utilities[':root'][key] = value
	}
	if (scheme === "light") {
		if (!utilities['@media (prefers-color-scheme: light)']) {
			utilities['@media (prefers-color-scheme: light)'] = {
				':root': {}
			}
		}

		utilities['@media (prefers-color-scheme: light)'][':root'][key] = value
	}
	if (scheme === "dark") {
		if (!utilities['@media (prefers-color-scheme: dark)']) {
			utilities['@media (prefers-color-scheme: dark)'] = {
				':root': {}
			}
		}

		utilities['@media (prefers-color-scheme: dark)'][':root'][key] = value
	}
}

export const parseTailthemesConfig = <T extends Config["theme"]>(config: InternalConfig<T> = {}, options?: Partial<TailthemesOptions>) => {
	let fullOptions: TailthemesOptions;
	if (!options) {
		fullOptions = defaultOptions
	} else {
		fullOptions = { ...defaultOptions, ...options }
	}
	const parsedConfig: ParsedConfig = {
		variants: [],
		utilities: {},
		theme: {}
	}
	const entries = Object.entries(config)
	entries.forEach((e) => {
		const themeName = e[0];
		const theme = e[1];
		const themeClass = fullOptions.classGenerator(themeName)
		const themeVariant = themeName

		const flatSubTheme = flattenSubTheme(theme)

		parsedConfig.variants.push({
			name: themeVariant,
			definition: [
				generateVariants(`.${themeClass}`),
				generateVariants(`[data-theme=${themeName}]`),
				generateRootVariants(theme.colorScheme)
			].flat()
		})
		const selector = `.${themeClass},[data-theme="${themeName}"]`;
		for (const key in flatSubTheme) {
			if (key === "colors") {
				addColorsToTheme(parsedConfig, fullOptions, flatSubTheme[key], selector, themeName, theme.colorScheme)
			}
			else {
				if (key === "colorScheme") {
					continue
				}
				const subConfig = createUtilitiesAndConfig(parsedConfig.utilities, fullOptions, flatSubTheme[key], selector, key, theme.colorScheme)

				if (!parsedConfig.theme) {
					parsedConfig.theme = {}
				}
				if (!parsedConfig.theme[key]) {
					parsedConfig.theme[key] = {}
				}
				Object.assign(parsedConfig.theme[key], subConfig)
			}
		}
	})
	return parsedConfig
}

function addColorsToTheme(config: ParsedConfig, options: TailthemesOptions, colors: { [key: string]: string }, selector: string, themeName: string, scheme: ColorSchemes | undefined) {
	const { utilities, configColors } = createHslaVariables(options, colors, selector, themeName, scheme)
	Object.entries(utilities).forEach(([k, v]) => {
		config.utilities[k] = v
	})


	const colorObj: { [key: string]: string } = {}
	Object.entries(configColors).forEach(([k, v]) => {
		colorObj[k] = v
	})

	if (!config.theme) {
		config.theme = {}
	}
	if (!config.theme.colors) {
		config.theme.colors = {}
	}
	Object.assign(config.theme.colors, colorObj)
}

function createHslaVariables(options: TailthemesOptions, colors: { [key: string]: string }, cssSelector: string, themeName: string, scheme: ColorSchemes | undefined): { utilities: Utilities, configColors: { [key: string]: string } } {
	const utilities: Utilities = {}
	const configColors: { [key: string]: any } = {}
	Object.entries(colors).forEach(([colorName, color]) => {
		let [h, s, l, a]: Hsla = [0, 0, 0, 1]
		try {
			[h, s, l, a] = toHsla(color);
		}
		catch (error: any) {
			throw new Error(`Invalid color in ${themeName} - ${colorName}: ${error.message} `)
		}


		const colorVariable = options.cssGenerator(colorName);

		const hslValues = `${h} ${s}% ${l}%`
		if (!utilities[cssSelector]) {
			utilities[cssSelector] = {}
		}
		utilities[cssSelector][colorVariable] = hslValues
		if (scheme) {
			addRootUtility(utilities, scheme, colorVariable, hslValues)
		}
		configColors[colorName] = `hsl(var(${colorVariable}))`
	})

	return { utilities, configColors }
}

function createUtilitiesAndConfig(utilities: Utilities, options: TailthemesOptions, values: { [key: string]: string }, cssSelector: string, key: string, scheme: ColorSchemes | undefined): { [key: string]: any } {
	const subConfig: { [key: string]: any } = {}

	Object.entries(values).forEach(([valueName, value]) => {
		const variable = options.cssGenerator(valueName, key)
		if (!utilities[cssSelector]) {
			utilities[cssSelector] = {}
		}

		utilities[cssSelector][variable] = value
		if (scheme) {
			addRootUtility(utilities, scheme, variable, value)
		}
		subConfig[valueName] = `var(${variable})`
	})

	return subConfig
}


function toHsla(color: string): Hsla {
	return Color(color).hsl().round(1).array() as Hsla
}



type Hsla = [number, number, number, number | undefined]




