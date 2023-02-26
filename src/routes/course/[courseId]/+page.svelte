<script lang="ts">
	import { page } from '$app/stores';
	import ReviewContent from '$lib/components/ReviewContent.svelte';
	import CourseInfo from '$lib/components/CourseInfo.svelte';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import { pb } from '$lib/glue/pocketbase';

	let course;

	const fetchCourse = async (pathname) => {
		if (pathname) {
			const courseId = pathname?.split('/')[2];
			try {
				course = await pb.collection('courses').getOne(courseId, {
					// expand: 'author,searcher,post'
				});
			} catch (error) {
				if (error?.status !== 404) throw error;
			}
		}
	};
	$: fetchCourse($page?.url?.pathname);
</script>

<PageContainer title="Course reviews" layout="aside-main">
	<Main>
		<div class="relative space-y-5 pt-6">
			<CourseInfo {course} />
			<div class="divider " />
			<ReviewContent {course} />
			<div class="divider " />
		</div>
	</Main>
	<Aside>
		<p>recently viewed</p>
		<p>popular courses</p>
		<p>hot opinions</p>
	</Aside>
</PageContainer>
