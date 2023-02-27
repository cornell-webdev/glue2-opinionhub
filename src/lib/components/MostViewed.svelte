<script>
	import { pb } from '$lib/glue/pocketbase';
	import IconStarFilled from '$lib/icons/glue/IconStarFilled.svelte';
	import averageStars from '$lib/util/averageStars';
	import { onMount } from 'svelte';

	let courses = [];

	const fetchCourses = async () => {
		try {
			const popularCourses = (
				await pb.collection('courses').getList(1, 5, {
					sort: '-updated',
					filter:
						'id="7x95m2bn1a7bi8f" || id="782fhj8m1otuu9l" || id="qicij4awha49sz5" || id="lwk1dl8da364wrc" || id="67nl35m5sc9p15v"'
				})
			)?.items;
			const promises = popularCourses?.map(async (course) => {
				const comments = await pb.collection('comments').getFullList(200, {
					filter: `course="${course?.id}"`
				});
				return {
					...course,
					comments
				};
			});
			courses = await Promise.all(promises);
		} catch (error) {}
	};

	onMount(() => {
		fetchCourses();
	});
</script>

<div class="sticky top-20 space-y-2">
	<h1 class="ml-1 text-2xl font-bold">Most viewed</h1>
	<div class="space-y-2">
		{#each courses as course (course?.id)}
			<div>
				<a href="/course/{course?.id}">
					<div class="rounded-xl bg-base-200 py-2 px-3 hover:bg-base-300">
						<div class="flex items-center space-x-2">
							<p class="text font-bold line-clamp-1">
								{course?.name}
								<span class="ml-0.5 font-medium text-base-content/70">{course?.subtitle}</span>
							</p>
						</div>
						<div class="flex items-center space-x-0.5 text-base-content/70">
							<span><IconStarFilled /></span>
							<p class="mt-0.5 text-sm">
								<span class="font-semibold">{averageStars(course?.comments)}</span> • {course
									?.comments?.length} opinions
							</p>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</div>
