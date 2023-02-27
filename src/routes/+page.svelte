<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import MostViewed from '$lib/components/MostViewed.svelte';
	import RecentlyViewed from '$lib/components/RecentlyViewed.svelte';
	import RecentOpinions from '$lib/components/RecentOpinions.svelte';
</script>

<PageContainer title="Home" layout="aside-main">
	<Main>
		<div class="py-4">
			<RecentOpinions />
		</div>
	</Main>

	<Aside>
		<MostViewed />
	</Aside>
</PageContainer>
