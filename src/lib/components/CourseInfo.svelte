<script>
	export let course;
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
		<p class="text-sm text-base-content/70">{course?.desc}</p>
	</div>
{/if}
