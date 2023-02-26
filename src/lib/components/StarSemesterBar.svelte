<script>
	import IconStarFilled from '$lib/icons/glue/IconStarFilled.svelte';

	export let semesterKey;
	export let stars;
</script>

<div class="flex flex-col items-center space-y-1">
	<div class="flex items-center">
		<span class="text-xs"><IconStarFilled /></span>
		<p class="text-xs font-semibold">{stars}</p>
	</div>
	<div
		style="--height: {Number((stars / 5) * 60)}px"
		class="star-bar-vertical w-6 rounded-sm bg-primary"
	/>
	<p class="text-xs font-semibold text-base-content/80">{semesterKey}</p>
</div>

<style>
	.star-bar-vertical {
		height: var(--height);
	}
</style>
