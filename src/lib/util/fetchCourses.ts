import { pb } from '$lib/glue/pocketbase';
import PocketBase from 'pocketbase';

const fetchCourses = async () => {
	console.log('fetchCourses');
	const sentimentPb = new PocketBase('https://glue2-sentiment.fly.dev/');
	const res = await sentimentPb.collection('topics').getFullList(200, {
		filter: 'category="course"'
	});
	const courses = res;
	// TODO: split into 20 arrays of arrays
	// save simultaneously
	// for (let i = 0; i < courses?.length; i++) {
	// 	const course = courses[i];
	// 	const { name, subtitle, desc, aliases, provider, providerId, pageView } = course;
	// 	try {
	// 		await pb.collection('courses').create({
	// 			name,
	// 			subtitle,
	// 			desc,
	// 			aliases,
	// 			provider,
	// 			providerId,
	// 			isInitialized: false,
	// 			pageView
	// 		});
	// 	} catch (error) {
	// 		// do nothing
	// 	}
	// 	console.log('saved', (i / courses?.length).toFixed(2));
	// }
};

export default fetchCourses;
