<script lang="ts">
	import { currentUser } from '$lib/glue/pocketbase';
	import IconBookmarkOutlined from '$lib/icons/glue/IconBookmarkOutlined.svelte';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import dynamicAgo from '$lib/util/glue/dynamicAgo';
	import sentimentToStars from '$lib/util/sentimentToStars';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';

	export let comment;

	let isExpanded = false;

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
</script>

{#if comment}
	<div class="my-3 space-y-2 border-b border-base-content/20 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div class="rating rating-sm">
					{#each [1, 2, 3, 4, 5] as stars}
						<input
							type="radio"
							name={`comment-rating-${comment?.id}`}
							class="mask mask-star-2 bg-yellow-400"
							checked={stars ===
								sentimentToStars({
									sentimentScore: comment?.sentimentScore,
									sentimentMagnitude: comment?.sentimentMagnitude
								})}
						/>
					{/each}
				</div>
				<p class="text-sm text-base-content/80">
					{dynamicAgo({
						date: new Date(comment?.providerCreated),
						formatString: 'y-MM-dd'
					})}
				</p>
			</div>
			<RequireAuthButton
				class="btn-success btn-outline btn-sm btn gap-1"
				on:click={() => {
					toggleHelpfulComment(comment?.id);
				}}
				><span class="text-lg"> <IconBookmarkOutlined /></span>
			</RequireAuthButton>
		</div>
		<p
			class={`cursor-pointer whitespace-pre-line ${
				isExpanded ? 'line-clamp-none' : 'line-clamp-3'
			}`}
			on:click={() => {
				isExpanded = !isExpanded;
			}}
		>
			{comment?.content}
		</p>
	</div>
{/if}
