import { pb } from '$lib/glue/pocketbase';
import PocketBase from 'pocketbase';

const fetchCourses = async () => {
	console.log('fetchCourses');
	const sentimentPb = new PocketBase('https://glue2-sentiment.fly.dev/');
	const res = await sentimentPb.collection('topics').getFullList(200, {
		filter: 'category="course"'
	});
	const courses = res;
	console.log('courses', courses);
	const chunks = [];
	const chunkSize = 325;
	for (let i = 0; i < courses.length; i += chunkSize) {
		const chunk = courses.slice(i, i + chunkSize);
		chunks.push(chunk);
	}
	console.log('chunks', chunks);
	const promises = chunks?.map(async (courses, idx) => {
		for (let i = 0; i < courses?.length; i++) {
			const course = courses[i];
			const { name, subtitle, desc, aliases, provider, providerId, pageView } = course;
			try {
				await pb.collection('courses').create({
					name,
					subtitle,
					desc,
					aliases,
					provider,
					providerId,
					isInitialized: false,
					pageView
				});
			} catch (error) {
				// do nothing
			}
			console.log('chunk', idx, ' | saved', (i / courses?.length).toFixed(2));
		}
	});
	await Promise.all(promises);
	console.log('complete');
};

export default fetchCourses;
