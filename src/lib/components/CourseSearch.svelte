<script lang="ts">
	import { pb } from '$lib/glue/pocketbase';
	import TextInput from './glue/TextInput.svelte';

	let suggestedCourses = [];
	let queryString = '';

	const fetchSuggestedCourses = async (queryString: string) => {
		try {
			if (!queryString) return;
			const res = await pb.collection('courses').getList(1, 5, {
				filter: `name~"${queryString}" || aliases~"${queryString}"`
			});
			suggestedCourses = res?.items;
		} catch (error) {}
	};
</script>

<div class="dropdown w-full">
	<div
		class="ml-[-0.5rem] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5"
	>
		<TextInput
			bind:value={queryString}
			on:input={(event) => {
				fetchSuggestedCourses(event?.target?.value);
			}}
			tabindex={0}
			class="input-sm rounded-full md:input-md"
			placeholder="Search for a course"
		/>
	</div>
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
				<p class="font-semibold">No courses were found</p>
				<p class="text-sm text-base-content/80">
					Please search in the format SUBJECT CODE (such as "cs 4701")
				</p>
			</div>
		{/if}
	</ul>
</div>
