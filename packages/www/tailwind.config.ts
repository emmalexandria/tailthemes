import { tailthemes, type TailthemesConfig, type TailthemesSchema } from "tailthemes";
import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

interface Schema extends TailthemesSchema {
	colors: {
		mono: {
			base: string,
			'text-light': string,
			border: string
			text: string
		},
		primary: {
			50: string,
			100: string,
			200: string,
			300: string,
			400: string,
			500: string,
			600: string,
			700: string,
			800: string,
			900: string,
			950: string
		}
	},
	fontFamily: {
		display: string,
		body: string
	},
	borderRadius: {
		DEFAULT: string
	},
	borderWidth: {
		DEFAULT: string
	}
}

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [tailthemes<Schema>({
		default: {
			colors: {
				mono: {
					base: '#f7f7f9',
					'text-light': '#726d88',
					border: "#8d8ba6",
					text: '#33313a',
				},
				primary: {
					'50': '#f0faff',
					'100': '#e0f5fe',
					'200': '#bae8fd',
					'300': '#7dd5fc',
					'400': '#38bdf8',
					'500': '#0ea6e9',
					'600': '#028ac7',
					'700': '#0370a1',
					'800': '#075e85',
					'900': '#0c506e',
					'950': '#083549',
				}
			},
			fontFamily: {
				display: "Inter Variable",
				body: "Inter Variable"
			},
			borderRadius: {
				DEFAULT: '0.5rem'
			},
			borderWidth: {
				DEFAULT: '1px'
			},
		},
		old: {
			colors: {
				mono: {
					base: '#f9f8f4',
					text: '#2e241c',
					border: '#b8a77f',
					'text-light': "#82694c"
				},
				primary: {
					'50': '#fef6ee',
					'100': '#fcebd8',
					'200': '#f8d3b0',
					'300': '#f4b37d',
					'400': '#ee8949',
					'500': '#ea6a25',
					'600': '#db521b',
					'700': '#b63d18',
					'800': '#91311b',
					'900': '#752b19',
					'950': '#3f130b',
				},
			},
			fontFamily: {
				display: "Playfair Display Variable",
				body: "Open Sans Variable"
			},
			borderRadius: {
				DEFAULT: '0.25rem'
			},
			borderWidth: {
				DEFAULT: "2px"
			}
		},
		terminal: {
			colors: {
				mono: {
					text: '#f6f6f6',
					'text-light': "#b0b0b0",
					border: '#f6f6f6',
					base: '#121212',
				},
				primary: {
					'50': '#f1fcf1',
					'100': '#defae0',
					'200': '#c0f2c2',
					'300': '#8ee793',
					'400': '#55d35d',
					'500': '#2fb838',
					'600': '#219929',
					'700': '#1d7824',
					'800': '#1c5f21',
					'900': '#194e1e',
					'950': '#082b0c',

				}
			},
			fontFamily: {
				body: 'Overpass Mono Variable',
				display: 'Overpass Mono Variable'
			},
			borderRadius: {
				DEFAULT: '0px'
			},
			borderWidth: {
				DEFAULT: '1px'
			},
		}
	} satisfies TailthemesConfig), typography],
} satisfies Config
