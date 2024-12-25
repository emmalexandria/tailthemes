export interface Theme {
	displayName: string
	name: string
	default?: boolean
}

const defaultTheme: Theme = {
	displayName: "Default",
	name: "default",
	default: true
}

const old: Theme = {
	displayName: "Old Fashioned",
	name: "old",
}

const terminal: Theme = {
	displayName: "Terminal",
	name: "terminal"
}

export const themes = [defaultTheme, old, terminal]

export const initTheme = (t: Theme) => {
	if (getActiveTheme() === t) {
		setThemeActive(t)
	}
}

export const getActiveTheme = (): Theme => {
	if (!import.meta.env.SSR) {
		if (localStorage.getItem("theme")) {
			const local = localStorage.getItem("theme");
			const theme = themes.find(t => t.name === local)
			if (theme) {
				return theme
			}
		}
		const el = document.documentElement
		const attr = el.getAttribute("data-theme")
		const theme = themes.find(t => t.name === attr)
		if (theme) {
			return theme
		}
	}
	return themes.find(t => t.default ?? false) ?? themes[0]
}

export const setThemeActive = (theme: Theme) => {
	const el = document.documentElement;
	el.setAttribute("data-theme", theme.name)
	localStorage.setItem("theme", theme.name)
}
