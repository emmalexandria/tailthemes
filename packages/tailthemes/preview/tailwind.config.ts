import { type Config } from "tailwindcss"
import { tailthemes, TailthemesConfig } from "../dist"

module.exports = {
	content: ['./**/*.{js,html}'],
	plugins: [
		tailthemes({
			test: {
				colors: {
					test: "#ff0000"
				},
				borderWidth: {
					hello: "1rem"
				},
				fontFamily: {
					"body": "Playfair Display"
				}
			},
			brown: {
				colors: {
					test: "#3f0b04"
				},
				borderWidth: {
					hello: "2px"
				},
				fontFamily: {
					"body": "Roboto"
				},
			}
		} satisfies TailthemesConfig)
	]
} satisfies Config


