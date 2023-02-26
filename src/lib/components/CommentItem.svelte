<script lang="ts">
	import { currentUser } from '$lib/glue/pocketbase';
	import IconBookmarkOutlined from '$lib/icons/glue/IconBookmarkOutlined.svelte';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import sentimentToStars from '$lib/util/sentimentToStars';
	import { formatDistanceToNowStrict } from 'date-fns';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';

	export let comment;
	export let isShowCourse = false;

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
	<div class="space-y-3 border-b border-base-content/20 pt-8 pb-7 last:border-b-0">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<!-- course -->
				{#if isShowCourse}
					<a href="/course/{comment?.course}">
						<button class="btn-primary btn-xs btn">
							{comment?.expand?.course?.name}
						</button>
					</a>
				{/if}

				<!-- rating -->
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

				<!-- author nickname -->
				<p class="text-sm text-base-content/80">{comment?.providerData?.author}</p>
			</div>
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
		<div class="flex items-center justify-end space-x-3">
			<div>
				<p class="text-sm text-base-content/80">
					{formatDistanceToNowStrict(new Date(comment?.providerCreated))} ago
				</p>
			</div>
			<RequireAuthButton
				class="btn-outline btn-success btn-xs btn gap-1 rounded-xl"
				on:click={() => {
					toggleHelpfulComment(comment?.id);
				}}
				><IconUpArrow /> {comment?.upvotes} helpful
			</RequireAuthButton>
		</div>
	</div>
{/if}
