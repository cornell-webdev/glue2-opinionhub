<script lang="ts">
	import CommentItem from '$lib/components/CommentItem.svelte';
	import IconDownKarat from '$lib/icons/glue/IconDownKarat.svelte';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import getComments from '$lib/util/getComments';
	import sortComments from '$lib/util/sortComments';
	import MyOpinionButtonModal from './MyOpinionButtonModal.svelte';

	export let course;

	let sort = 'helpful';
	const sortOptions = ['helpful', 'recent'];
	let comments = [];
	let isExpanded = false;

	const fetchComments = async (course) => {
		const fetchedComments = await getComments({ course });
		if (fetchedComments) {
			comments = sortComments({ comments: fetchedComments, sort });
		}
	};

	const updateCommentsSort = (sort: string) => {
		comments = sortComments({ comments, sort });
	};

	$: fetchComments(course);
	$: updateCommentsSort(sort);

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

{#if course}
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
					{#each comments?.slice(0, 2) as comment (comment?.id)}
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
{/if}
