<script>
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconAdd from '$lib/icons/glue/IconAdd.svelte';
	import TextInput from './glue/TextInput.svelte';
	import Textarea from './glue/Textarea.svelte';

	export let course;

	let content = '';
	let stars = 5;
	let nickname = '';
	let error = '';
	let loading = false;

	const handleSubmit = async () => {
		loading = true;

		if (!$currentUser?.nickname) {
			if (!nickname) {
				error = 'Please enter a nickname';
				return;
			}

			await pb.collection('users').update($currentUser.id, {
				nickname
			});
		}
		await pb.collection('comments').create({
			course: course?.id,
			content,
			upvotes: 1,
			stars,
			user: $currentUser?.id
		});
		location.reload();
		loading = false;
	};
</script>

<label for="modal-my-opinion" class="btn-primary btn-sm btn"><IconAdd /> Add opinion</label>

<input type="checkbox" id="modal-my-opinion" class="modal-toggle" />
<label for="modal-my-opinion" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<form on:submit={handleSubmit}>
			<h3 class="text-3xl font-extrabold">Add opinion</h3>
			<div class="rating-xl rating mt-4">
				{#each [1, 2, 3, 4, 5] as starValue}
					<input
						type="radio"
						class="mask mask-star-2 bg-yellow-400"
						checked={starValue === stars}
						on:input={() => {
							stars = starValue;
						}}
					/>
				{/each}
			</div>
			<Textarea bind:value={content} placeholder="What did you think about the course?" />
			{#if !$currentUser?.nickname}
				<div class="divider w-full" />
				<p class="text-lg font-extrabold">Nickname</p>
				<p class="text-sm text-base-content/70">
					You won't be able to change your nickname after you submit.
				</p>
				<TextInput class="mt-2" bind:value={nickname} />
			{/if}
			<button class="btn-primary btn mt-8 {loading && 'loading'}">Submit</button>
		</form>
	</label>
</label>
