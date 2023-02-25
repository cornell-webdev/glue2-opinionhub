<script>
	export let course;

	let isDescExpanded = false;
</script>

{#if course}
	<div class="space-y-4">
		<h2 class="text-4xl font-bold">{course?.name}</h2>
		<div>
			<h4 class="mb-0">{course?.subtitle}</h4>
			{#if course?.aliases}
				<p>
					Also known as:

					{#each course?.aliases?.split(',') as alias}
						<span class="font-semibold">{alias}</span>
					{/each}
				</p>
			{/if}
		</div>

		<div
			class="cursor-pointer rounded-xl py-3 hover:bg-base-200"
			on:click={() => {
				isDescExpanded = !isDescExpanded;
			}}
		>
			<p
				class={`text-sm text-base-content/70 ${
					isDescExpanded ? 'line-clamp-none' : 'line-clamp-3'
				}`}
			>
				{course?.desc}
			</p>
		</div>
	</div>
{/if}
