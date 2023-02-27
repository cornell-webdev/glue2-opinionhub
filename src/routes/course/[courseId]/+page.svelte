<script lang="ts">
	import { page } from '$app/stores';
	import CourseInfo from '$lib/components/CourseInfo.svelte';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import MostViewed from '$lib/components/MostViewed.svelte';
	import ReviewContent from '$lib/components/ReviewContent.svelte';
	import { pb } from '$lib/glue/pocketbase';

	let course;

	const fetchCourse = async (pathname) => {
		if (pathname) {
			const courseId = pathname?.split('/')[2];
			try {
				course = await pb.collection('courses').getOne(courseId);
				pb.collection('courses').update(course?.id, {
					pageView: course?.pageView + 1
				});
			} catch (error) {}
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
		<MostViewed />
	</Aside>
</PageContainer>
