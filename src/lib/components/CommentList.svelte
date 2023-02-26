<script lang="ts">
	import CommentItem from '$lib/components/CommentItem.svelte';
	import getComments from '$lib/util/getComments';
	import sortComments from '$lib/util/sortComments';
	import MyOpinionButtonModal from './MyOpinionButtonModal.svelte';

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
				{#each comments as comment (comment?.id)}
					<CommentItem {comment} />
				{/each}
			</div>
		</div>
	</div>
{/if}
