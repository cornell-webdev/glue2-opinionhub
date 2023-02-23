<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import RequireAuthButton from '$lib/components/glue/RequireAuthButton.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import dynamicAgo from '$lib/util/glue/dynamicAgo';
	import scrapeCommentsByQueryString from '$lib/util/scrapeCommentsByQueryString';
	import { onMount } from 'svelte';

	let queryString = 'cs 4300';
	let sort = 'upvotes';
	let query;
	let comments = [];
	let userCommentIdToHelpfulId = {};

	const handleSubmit = async () => {
		const scrapeResults = await scrapeCommentsByQueryString({ queryString, sort });
		query = scrapeResults?.query;
		comments = scrapeResults?.comments || [];
	};

	const toggleHelpfulComment = async (commentId: string) => {
		if (userCommentIdToHelpfulId[commentId]) {
			// unmark helpful
			comments = comments?.map((comment) => {
				if (comment?.id !== commentId) return comment;
				return {
					...comment,
					helpful: comment?.helpful - 1
				};
			});
			pb.collection('users_comments_helpful').delete(userCommentIdToHelpfulId[commentId]);
			delete userCommentIdToHelpfulId[commentId];
		} else {
			// mark helpful
			userCommentIdToHelpfulId[commentId] = true;
			comments = comments?.map((comment) => {
				if (comment?.id !== commentId) return comment;
				return {
					...comment,
					helpful: comment?.helpful + 1
				};
			});
			const userCommentHelpful = await pb.collection('users_comments_helpful').create({
				user: $currentUser?.id,
				comment: commentId
			});
			userCommentIdToHelpfulId[commentId] = userCommentHelpful?.id;
		}
	};

	const fetchUserHelpfulCommentIds = async () => {
		const helpfuls = await pb.collection('users_comments_helpful').getFullList(200, {
			filter: `user="${$currentUser?.id}"`
		});
		helpfuls?.forEach((helpful) => {
			userCommentIdToHelpfulId[helpful?.comment] = helpful?.id;
		});
	};

	onMount(() => {
		fetchUserHelpfulCommentIds();
	});
</script>

<PageContainer title="Home" layout="aside-main">
	<Main>
		<form on:submit={handleSubmit} class="flex items-center space-x-2">
			<TextInput bind:value={queryString} />
			<button class="btn-primary btn">Search</button>
		</form>
		<div class="mt-4">
			{#each comments as comment (comment?.id)}
				<div class="my-2 space-y-3 border-b border-base-content/20 py-4 px-2">
					<p class="whitespace-pre-line">{comment?.content}</p>
					<div class="flex items-center space-x-2">
						<RequireAuthButton
							class="btn-outline btn-success btn-xs btn gap-1"
							on:click={() => {
								toggleHelpfulComment(comment?.id);
							}}
							><span class="text-lg"><IconUpArrow /></span> {comment?.helpful} Helpful
						</RequireAuthButton>
						<p class="text-sm text-base-content/80">
							{comment?.upvotes} upvotes • {dynamicAgo({
								date: new Date(comment?.providerCreated),
								formatString: 'y-MM-dd'
							})} •
							<a target="_blank" rel="noreferrer" href={comment?.providerUrl} class="link"
								>See on Reddit</a
							>
						</p>
					</div>
				</div>
			{/each}
		</div>
	</Main>
	<Aside>popular searches</Aside>
</PageContainer>
