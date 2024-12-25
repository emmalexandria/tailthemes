import { tailthemes, type TailthemesConfig } from "tailthemes";
import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [tailthemes({
		default: {
			colors: {
				mono: {
					'50': '#f7f7f9',
					'100': '#eaeaef',
					'200': '#dadae3',
					'300': '#c0c1d0',
					'400': '#a2a2b8',
					'500': '#8d8ba6',
					'600': '#7d7a96',
					'700': '#726d88',
					'800': '#605c71',
					'900': '#4f4c5c',
					'950': '#33313a',
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
			}
		},
		old: {
			colors: {
				mono: {
					'50': '#f9f8f4',
					'100': '#f0eee4',
					'200': '#e0dbc8',
					'300': '#cdc3a4',
					'400': '#b8a77f',
					'500': '#a99166',
					'600': '#9c815a',
					'700': '#82694c',
					'800': '#6a5642',
					'900': '#574737',
					'950': '#2e241c',
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
				display: "Playfair Display",
				body: "Playfair Display"
			}
		}
	} satisfies TailthemesConfig), typography],
} satisfies Config
