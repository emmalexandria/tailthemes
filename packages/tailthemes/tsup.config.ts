import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["./src/index.ts", "./src/themes/*"],
	dts: true,
	sourcemap: true,
	format: ["cjs", "esm"],
	clean: true,
})
