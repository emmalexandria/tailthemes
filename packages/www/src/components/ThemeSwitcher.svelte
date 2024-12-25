<script lang="ts">
	import { themes, setThemeActive, getActiveTheme } from "../lib/themes";

	let select: HTMLSelectElement;
</script>

<select
	class="px-2 py-1 rounded bg-mono-base border border-mono-border"
	bind:this={select}
	onchange={() => {
		const theme = themes.find((t) => t.name === select.value);
		if (theme) {
			setThemeActive(theme);
		}
	}}
>
	{#each themes as theme}
		<option
			selected={getActiveTheme().name === theme.name}
			data-theme={theme.name}
			value={theme.name}
		>
			{theme.displayName}
		</option>
	{/each}
</select>
