<script>
	import { pb } from '$lib/glue/pocketbase';
	import IconDownKarat from '$lib/icons/glue/IconDownKarat.svelte';
	import CommentItem from './CommentItem.svelte';

	let comments = [];
	let page = 1;

	const fetchComments = async (page) => {
		try {
			const fetchedComments = (
				await pb.collection('comments').getList(page, 6, {
					sort: '-providerCreated',
					expand: 'course,user'
				})
			)?.items;
			comments = [...comments, ...fetchedComments];
		} catch (error) {}
	};

	$: fetchComments(page);
</script>

<div class="space-y-2">
	<h1 class="text-2xl font-bold">Recent opinions</h1>

	<div class="hidden md:block">
		{#each comments as comment (comment?.id)}
			<CommentItem {comment} isShowCourse={true} />
		{/each}
	</div>

	<div class="block md:hidden">
		{#each comments?.slice(0, page * 3) as comment (comment?.id)}
			<CommentItem {comment} isShowCourse={true} />
		{/each}
	</div>

	<div class="flex justify-center">
		<button
			class="btn-primary btn gap-1 rounded-full"
			on:click={() => {
				page += 1;
			}}
		>
			<span class="text-2xl"><IconDownKarat /></span> Show more
		</button>
	</div>
</div>
