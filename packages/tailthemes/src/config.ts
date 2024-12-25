import { Config } from "tailwindcss";
import { InternalConfig, type TailwindTheme } from "./plugin"
import Color from "color"

type ParsedConfig = {
	variants: Variants,
	utilities: Utilities,
	theme: TailwindTheme
}

type Variants = Array<{ name: string; definition: string[] }>;
type Utilities = { [selector: string]: Record<string, any> }

function defaultCssVariable(themeName: string) {
	return `--themewind-${themeName}`
}

function defaultThemeClass(themeName: string) {
	return themeName;
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


export function flattenTheme(theme: TailwindTheme): { [key: string]: any } {
	let flattened: { [key: string]: any } = {}
	//Iterate through each theme in the theme config
	for (const field in theme) {
		for (const subfield in theme[field]) {
			const entry: { [key: string]: any } = {};
			entry[field] = theme[field][subfield]
			const flattenedEntry = flattenObject(entry);
			Object.entries(flattenedEntry).forEach(([k, v]) => {
				if (!flattened[subfield]) {
					flattened[subfield] = {}
				}
				flattened[subfield][k] = v
			})
		}
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


const generateRootVariants = (themeName: string): string[] => {
	const baseDefs = [
		`:root&`,
		`:is(:root > &:not([data-theme]))`,
		`:is(:root &:not([data-theme] *):not([data-theme]))`
	];

	return baseDefs
}

const produceSafeName = (themeName: string): string => {
	return themeName.trim().replace("\s+", "-").toLowerCase()
}

function addColorsToTheme(config: ParsedConfig, colors: { [key: string]: string }, selector: string, themeName: string) {
	const { utilities, configColors } = createHslaVariables(colors, selector, themeName)
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

export const parseTailthemesConfig = <T extends Config["theme"]>(config: InternalConfig<T> = {}) => {
	const parsedConfig: ParsedConfig = {
		variants: [],
		utilities: {},
		theme: {}
	}

	const entries = Object.entries(config)
	entries.forEach((e) => {
		const themeName = e[0];
		const theme = e[1];

		const themeClass = produceSafeName(themeName)
		const themeVariant = themeName

		const flatSubTheme = flattenSubTheme(theme)

		parsedConfig.variants.push({
			name: themeVariant,
			definition: [
				generateVariants(`.${themeClass}`),
				generateVariants(`[data-theme=${themeName}]`)
			].flat()
		})
		const selector = `.${themeClass},[data-theme="${themeName}"]`;
		for (const key in flatSubTheme) {
			if (key === "colors") {
				addColorsToTheme(parsedConfig, flatSubTheme[key], selector, themeName)
			}
			else {
				const { utilities, subConfig } = createUtilitiesAndConfig(flatSubTheme[key], selector, key)
				Object.entries(utilities).forEach(([k, v]) => {
					if (!parsedConfig.utilities[k]) {
						parsedConfig.utilities[k] = {}
					}
					Object.assign(parsedConfig.utilities[k], v)
				})
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

function createHslaVariables(colors: { [key: string]: string }, cssSelector: string, themeName: string): { utilities: Utilities, configColors: { [key: string]: string } } {
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


		const colorVariable = `--themewind-${colorName}`;

		const hslValues = `${h} ${s}% ${l}%`
		if (!utilities[cssSelector]) {
			utilities[cssSelector] = {}
		}
		utilities[cssSelector][colorVariable] = hslValues
		configColors[colorName] = `hsl(var(${colorVariable}))`
	})

	return { utilities, configColors }
}

function createUtilitiesAndConfig(values: { [key: string]: string }, cssSelector: string, key: string): { utilities: Utilities, subConfig: { [key: string]: any } } {
	const utilities: Utilities = {}
	const subConfig: { [key: string]: any } = {}

	Object.entries(values).forEach(([valueName, value]) => {
		const variable = `--themewind-${key}-${valueName}`
		if (!utilities[cssSelector]) {
			utilities[cssSelector] = {}
		}
		utilities[cssSelector][variable] = value
		subConfig[valueName] = `var(${variable})`
	})

	return { utilities, subConfig }
}


function toHsla(color: string): Hsla {
	return Color(color).hsl().round(1).array() as Hsla
}



type Hsla = [number, number, number, number | undefined]




