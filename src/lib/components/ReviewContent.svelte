<script lang="ts">
	import CommentItem from '$lib/components/CommentItem.svelte';
	import IconDownKarat from '$lib/icons/glue/IconDownKarat.svelte';
	import IconStarFilled from '$lib/icons/glue/IconStarFilled.svelte';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import dateToSemesterKey from '$lib/util/dateToSemesterKey';
	import getComments from '$lib/util/getComments';
	import sentimentToStars from '$lib/util/sentimentToStars';
	import sortComments from '$lib/util/sortComments';
	import MyOpinionButtonModal from './MyOpinionButtonModal.svelte';
	import StarSemesterBar from './StarSemesterBar.svelte';

	export let course;

	let sort = 'helpful';
	const sortOptions = ['helpful', 'recent'];
	let comments = [];
	let isExpanded = false;
	let starCounter = [0, 0, 0, 0, 0, 0];
	let starsTrend = [];
	let innerWidth = 0;

	const fetchComments = async (course) => {
		const fetchedComments = await getComments({ course });
		if (fetchedComments) {
			comments = sortComments({ comments: fetchedComments, sort });
		}
	};

	const updateCommentsSort = (sort: string) => {
		comments = sortComments({ comments, sort });
	};

	const updateStarCounter = (comments) => {
		const newCounter = [0, 0, 0, 0, 0, 0];
		comments?.forEach((comment) => {
			const stars =
				comment?.provider === 'reddit'
					? sentimentToStars({
							sentimentScore: comment?.sentimentScore,
							sentimentMagnitude: comment?.sentimentMagnitude
					  })
					: comment?.stars;
			newCounter[stars] += 1;
		});
		starCounter = newCounter;
	};

	const updateStarsTrend = (comments) => {
		const counter = {};

		comments?.forEach((comment) => {
			const created = new Date(comment?.providerCreated || comment?.created);
			const semesterKey = dateToSemesterKey(created);
			const stars =
				comment?.provider === 'reddit'
					? sentimentToStars({
							sentimentScore: comment?.sentimentScore,
							sentimentMagnitude: comment?.sentimentMagnitude
					  })
					: comment?.stars;

			if (semesterKey in counter) {
				counter[semesterKey]?.push(stars);
			} else {
				counter[semesterKey] = [stars];
			}
		});

		const counterArray = [];
		const average = (array) => array.reduce((a, b) => a + b) / array.length;
		Object.entries(counter)?.forEach(([key, stars]) => {
			counterArray?.push([key, average(stars)?.toFixed(1)]);
		});
		counterArray?.sort((a, b) => {
			const semA = a[0]?.slice(0, 2);
			const semB = b[0]?.slice(0, 2);
			const yearA = a[0]?.slice(2, 4);
			const yearB = b[0]?.slice(2, 4);

			if (yearA === yearB) {
				return semA - semB;
			} else {
				return Number(yearA) - Number(yearB);
			}
		});
		starsTrend = counterArray;
	};

	$: fetchComments(course);
	$: updateCommentsSort(sort);
	$: updateStarCounter(comments);
	$: updateStarsTrend(comments);

	// TODO: helpful feature
	// let userCommentIdToHelpfulId = {};

	// const fetchUserHelpfulCommentIds = async () => {
	// 	const helpfuls = await pb.collection('users_comments_helpful').getFullList(200, {
	// 		filter: `user="${$currentUser?.id}"`
	// 	});
	// 	helpfuls?.forEach((helpful) => {
	// 		userCommentIdToHelpfulId[helpful?.comment] = helpful?.id;
	// 	});
	// };

	// onMount(() => {
	// 	fetchUserHelpfulCommentIds();
	// });
</script>

<svelte:window bind:innerWidth />

{#if course}
	<div class="space-y-5">
		<!-- section: analytics -->
		<div class="flex space-x-4">
			<div>
				<h2 class="text-lg font-bold">Distribution</h2>
				<div class="min-w-[10rem] ">
					{#each starCounter?.slice(0, 5) as _, idx}
						<div class="flex items-center space-x-2">
							<div class="flex items-center space-x-0.5">
								<span class="mt-1 text-xs"><IconStarFilled /></span>
								<p class="mt-1 text-xs font-bold">
									{idx + 1}
								</p>
							</div>
							<div class="relative mb-0.5 w-full">
								<div class="absolute h-2 w-full rounded-full bg-base-content/10" />
								<div
									style="--width: {Number(
										(starCounter[idx + 1] / Math.max(...starCounter)).toFixed(2)
									) * 100}%"
									class="star-bar absolute h-2 rounded-full bg-primary"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="flex flex-1 flex-col">
				<h2 class="text-lg font-bold">Over time</h2>
				<div class="flex flex-1 items-end space-x-3 sm:hidden">
					{#each starsTrend?.slice(-4) as [semesterKey, stars]}
						<StarSemesterBar {semesterKey} {stars} />
					{/each}
				</div>
				<div class="hidden flex-1 items-end space-x-3 sm:flex md:hidden">
					{#each starsTrend?.slice(-6) as [semesterKey, stars]}
						<StarSemesterBar {semesterKey} {stars} />
					{/each}
				</div>
				<div class="hidden flex-1 items-end space-x-3 md:flex">
					{#each starsTrend?.slice(-8) as [semesterKey, stars]}
						<StarSemesterBar {semesterKey} {stars} />
					{/each}
				</div>
			</div>
		</div>

		<div class="divider" />

		<!-- section: all opinions -->
		<div class="space-y-6">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-bold">All opinions</h2>
				<MyOpinionButtonModal />
			</div>

			<div>
				<!-- sort select -->
				<select class="select-bordered select select-sm ml-[-0.5rem]" bind:value={sort}>
					{#each sortOptions as option}
						<option value={option}>Sort by: {option}</option>
					{/each}
				</select>

				<!-- comments list -->
				<div class="">
					{#if isExpanded}
						{#each comments as comment (comment?.id)}
							<CommentItem {comment} />
						{/each}
					{:else}
						{#each comments?.slice(0, 3) as comment (comment?.id)}
							<CommentItem {comment} />
						{/each}
					{/if}
				</div>

				<!-- expand / collapse button -->
				{#if comments?.length > 2}
					<div class={`flex justify-center ${isExpanded && 'sticky bottom-12'}`}>
						<button
							class="btn-primary btn gap-1 rounded-full"
							on:click={() => {
								isExpanded = !isExpanded;
							}}
						>
							{#if isExpanded}
								<span class="text-2xl"><IconUpArrow /></span> Show less
							{:else}
								<span class="text-2xl"><IconDownKarat /></span> Show {comments?.length - 2} more
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.star-bar {
		width: var(--width);
	}
</style>
