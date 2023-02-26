<script>
	import { pb } from '$lib/glue/pocketbase';
	import IconDownKarat from '$lib/icons/glue/IconDownKarat.svelte';
	import { onMount } from 'svelte';
	import CommentItem from './CommentItem.svelte';

	let comments = [];
	let page = 1;

	const fetchComments = async () => {
		const fetchedComments = (
			await pb.collection('comments').getList(page, 20, {
				sort: '-providerCreated',
				expand: 'course'
			})
		)?.items;
		comments = [...comments, ...fetchedComments];
	};

	onMount(() => {
		fetchComments();
	});
</script>

<div class="space-y-2">
	<h1 class="text-2xl font-bold">Recent opinions</h1>
	<div>
		{#each comments as comment (comment?.id)}
			<CommentItem {comment} isShowCourse={true} />
		{/each}
	</div>
	<div class="flex justify-center">
		<button
			class="btn-primary btn gap-1 rounded-full"
			on:click={() => {
				page += 1;
				fetchComments();
			}}
		>
			<span class="text-2xl"><IconDownKarat /></span> Show more
		</button>
	</div>
</div>
