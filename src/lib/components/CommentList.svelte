<script lang="ts">
	import CommentItem from '$lib/components/CommentItem.svelte';
	import getComments from '$lib/util/getComments';
	import sortComments from '$lib/util/sortComments';

	export let course;

	let sort = 'helpful';
	const sortOptions = ['helpful', 'recent'];
	let comments = [];

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
	<div class="space-y-4">
		<h2 class="text-2xl font-semibold">All opinions</h2>

		<!-- sort select -->
		<div class="form-control w-full max-w-[12rem]">
			<label class="label">
				<span class="label-text">Sort by</span>
			</label>
			<select class="select-bordered select" bind:value={sort}>
				{#each sortOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<!-- comments list -->
		{#each comments as comment (comment?.id)}
			<CommentItem {comment} />
		{/each}
	</div>
{/if}
