<script lang="ts">
	import CourseSearch from '$lib/components/CourseSearch.svelte';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
</script>

<PageContainer title="Home" layout="aside-main">
	<Main>
		<CourseSearch />
	</Main>
	<Aside>
		<p>popular courses</p>
		<p>hot opinions</p>
	</Aside>
</PageContainer>
