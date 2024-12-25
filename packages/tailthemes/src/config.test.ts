import { test, expect } from "vitest"
import { flattenSubTheme, flattenTheme, parseTailthemesConfig } from "./config"

test("Test theme flattening", () => {
	expect(flattenTheme({
		hello: {
			colors: {
				red: {
					500: "#ff0000"
				},
				green: "#00ff00"
			},
			borderRadius: {
				sm: '1px'
			}
		},
		test: {
			borderRadius: {
				lg: '2px'
			}
		}
	})).toEqual({
		colors: {
			"hello-red-500": "#ff0000",
			"hello-green": "#00ff00"
		},
		borderRadius: {
			"hello-sm": "1px",
			"test-lg": "2px"
		}
	})
})

test("Test flattening subtheme", () => {
	expect(flattenSubTheme({
		colors: {
			red: {
				"base": "#ff0000",
				500: "#ff0000"
			}
		},
		borderRadius: {
			sm: "2px",
		}
	})).toEqual({
		colors: {
			"red-base": "#ff0000",
			"red-500": "#ff0000",
		},
		borderRadius: {
			sm: "2px"
		}
	})

})

test("Test parsing config", () => {
	expect(parseTailthemesConfig({
		hello: {
			colors: {
				red: {
					500: "#ff0000"
				},
				green: "#00ff00"
			},
			borderRadius: {
				sm: '1px'
			}
		},
		test: {
			colors: {
				test: "#f3df31",
			},
			borderRadius: {
				lg: '2px'
			}
		}
	})).toEqual({})
})

test("Test parsing config with defaults", () => {
	expect(parseTailthemesConfig({
		hello: {
			colors: {
				red: {
					500: "#ff0000"
				},
				green: "#00ff00"
			},
			borderRadius: {
				sm: '1px'
			},
			colorScheme: 'dark'
		},
		test: {
			colors: {
				test: "#f3df31",
			},
			borderRadius: {
				lg: '2px'
			},
			colorScheme: 'light'
		}
	})).toEqual({})
})

