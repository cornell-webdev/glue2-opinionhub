<script lang="ts">
	import { dev } from '$app/environment';
	import { pb } from '$lib/glue/pocketbase';
	import TextInput from './glue/TextInput.svelte';

	let suggestedCourses = [];
	let queryString = dev ? 'cs 2110' : '';

	const fetchSuggestedCourses = async (queryString: string) => {
		if (!queryString) return;
		const res = await pb.collection('courses').getList(1, 5, {
			filter: `name~"${queryString}" || aliases~"${queryString}"`
		});
		suggestedCourses = res?.items;
	};

	$: fetchSuggestedCourses(queryString);
</script>

<div class="dropdown w-full">
	<TextInput
		bind:value={queryString}
		tabindex={0}
		class="rounded-full"
		placeholder="Search for a course"
	/>
	<ul tabindex="0" class="dropdown-content menu rounded-box mt-2 w-full bg-base-200 p-2 shadow">
		{#if suggestedCourses && suggestedCourses?.length > 0}
			{#each suggestedCourses as course}
				<li class="w-full">
					<a href={`/course/${course?.id}`} class="w-full truncate line-clamp-1">
						{course?.name}
						<span class="text-sm text-base-content/70">{course?.subtitle}</span>
					</a>
				</li>
			{/each}
		{:else}
			<div class="p-2">
				<p>No courses were found</p>
				<p>Please search in the format SUBJECT CODE ex) cs 4701</p>
			</div>
		{/if}
	</ul>
</div>
