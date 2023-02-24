<script>
	import CommentItem from '$lib/components/CommentItem.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import getComments from '$lib/util/getComments';
	import sortComments from '$lib/util/sortComments';
	import { onMount } from 'svelte';

	export let course;

	let sort = 'upvotes';
	let comments = [];

	const fetchComments = async (course) => {
		const fetchedComments = await getComments({ course });
		if (fetchedComments) {
			comments = sortComments({ comments: fetchedComments, sort });
		}
	};

	$: fetchComments(course);

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
	<div>
		{#each comments as comment (comment?.id)}
			<CommentItem {comment} />
		{/each}
	</div>
{/if}
