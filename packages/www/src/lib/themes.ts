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

export const themes = [defaultTheme, old]

export const initTheme = (theme: Theme) => {
	if (localStorage.getItem("theme") === theme.name) {
		setThemeActive(theme)
	}
	else if (theme.default === true) {
		setThemeActive(theme)
	}
}

export const setThemeActive = (theme: Theme) => {
	const el = document.documentElement;
	el.removeAttribute("data-theme");
	el.setAttribute("data-theme", theme.name)
}
