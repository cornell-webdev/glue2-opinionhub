<script lang="ts">
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import sentimentToStars from '$lib/util/sentimentToStars';
	import { formatDistanceToNowStrict } from 'date-fns';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';

	export let comment;
	export let isShowCourse = false;

	$: stars = comment?.sentimentScore
		? sentimentToStars({
				sentimentScore: comment?.sentimentScore,
				sentimentMagnitude: comment?.sentimentMagnitude
		  })
		: comment?.stars;

	let isExpanded = false;

	const toggleHelpfulComment = async (targetComment) => {
		if ($currentUser?.likedComments?.includes(targetComment?.id)) {
			await pb.collection('users').update($currentUser?.id, {
				likedComments: $currentUser?.likedComments?.filter((id) => id !== targetComment?.id)
			});
			comment = await pb.collection('comments').update(targetComment?.id, {
				upvotes: targetComment?.upvotes - 1
			});
		} else {
			await pb.collection('users').update($currentUser?.id, {
				likedComments: [...$currentUser?.likedComments, targetComment?.id]
			});
			comment = await pb.collection('comments').update(targetComment?.id, {
				upvotes: targetComment?.upvotes + 1
			});
		}
	};
</script>

{#if comment}
	<div class="border-b border-base-content/20 last:border-b-0">
		<a href={isShowCourse ? `/course/${comment?.course}` : undefined}>
			<div class="space-y-3 pt-8 pb-7">
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
							{#each [1, 2, 3, 4, 5] as starsValue}
								<input
									type="radio"
									name={`comment-rating-${comment?.id}`}
									class="mask mask-star-2 bg-yellow-400"
									checked={starsValue === stars}
								/>
							{/each}
						</div>

						<!-- author nickname -->
						<p class="text-sm text-base-content/80">
							{comment?.expand?.user?.nickname || comment?.providerData?.author}
						</p>
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
							{formatDistanceToNowStrict(new Date(comment?.providerCreated || comment?.created))} ago
						</p>
					</div>
					<RequireAuthButton
						class="btn-success btn-xs btn gap-1 rounded-xl {$currentUser?.likedComments?.includes(
							comment?.id
						)
							? ''
							: 'btn-outline'}"
						on:click={() => {
							toggleHelpfulComment(comment);
						}}
						><IconUpArrow />
						{comment?.upvotes} helpful
					</RequireAuthButton>
				</div>
			</div>
		</a>
	</div>
{/if}
