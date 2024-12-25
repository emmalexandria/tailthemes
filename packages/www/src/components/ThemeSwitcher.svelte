<script lang="ts">
	import { themes, setThemeActive } from "../lib/themes";

	let select: HTMLSelectElement;
</script>

<select
	bind:this={select}
	onchange={() => {
		const theme = themes.find((t) => t.name === select.value);
		if (theme) {
			setThemeActive(theme);
		}
	}}
>
	{#each themes as theme}
		<option data-theme={theme.name} value={theme.name}>
			{theme.displayName}
		</option>
	{/each}
</select>
