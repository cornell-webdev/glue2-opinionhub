import axios from 'axios';
import { GOOGLE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

const fetchSentiment = async (content: string) => {
	const URL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${GOOGLE_API_KEY}`;

	const { data } = await axios.post(URL, {
		document: {
			content,
			type: 'PLAIN_TEXT'
		},
		encodingType: 'UTF32'
	});

	return data;
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { content } = await request.json();
	const sentimentData = await fetchSentiment(content);
	return json(sentimentData);
}
