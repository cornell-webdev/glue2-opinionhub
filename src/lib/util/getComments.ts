import { pb } from '$lib/glue/pocketbase';
import axios from 'axios';
import type { Record } from 'pocketbase';

interface IScrapeCommentsByQuery {
	course: Record;
}

const getCourseCode = (queryString: string): string => {
	const numberMatch = queryString.match(/\d+/);
	if (numberMatch && numberMatch?.length > 0) {
		return numberMatch[0];
	}
	return '';
};

const getComments = async ({ course }: IScrapeCommentsByQuery) => {
	try {
		if (!course) return null;

		const comments = await pb.collection('comments').getFullList(200, {
			filter: `course="${course?.id}"`,
			expand: 'user'
		});

		// if comments exist, return them
		if (comments?.length > 0) {
			return comments;
		}

		// keywords to scrape by
		const keywords = [course?.name, course?.name?.split(' ')?.join('')];
		const aliases = course?.aliases?.split(',');
		const courseCode = getCourseCode(course?.name);

		for (let i = 0; i < aliases?.length; i++) {
			const alias = aliases[i];
			keywords?.push(alias);
			keywords?.push(alias?.split(' ')?.join(''));
		}

		// for each keyword
		const keywordPromises = keywords?.map(async (keyword) => {
			const { data } = await axios(
				`https://www.reddit.com/r/Cornell/search/.json?q=${encodeURIComponent(
					keyword
				)}&limit=30&restrict_sr=1&sr_nsfw=`
			);

			// for each question post, get comments
			const commentPromises = data?.data?.children?.map(async ({ data }) => {
				const { selftext: postContent, title: postTitle, permalink } = data;

				// if post is a relevant question
				if (
					(postContent?.toLowerCase()?.includes(courseCode) ||
						postTitle?.toLowerCase()?.includes(courseCode)) &&
					(postContent?.includes('?') || postTitle?.includes('?'))
				) {
					const { data: postData } = await axios.get(`https://www.reddit.com${permalink}.json`);
					const questionRawData = postData[0]?.data?.children[0]?.data;
					const { media_metadata } = questionRawData;

					// if post is a photo, deleted, poll
					if (
						media_metadata ||
						postTitle?.includes('[deleted]') ||
						postContent?.includes('[deleted]') ||
						postContent?.includes('View Poll')
					) {
						return null;
					}

					// if question has comments
					if (postData?.length >= 2) {
						const redditComments = postData[1]?.data?.children;
						const comments = [];

						// for each comment
						for (let i = 0; i < redditComments?.length; i++) {
							const commentDataRaw = redditComments[i]?.data;
							const { body, id, permalink, score, created_utc } = commentDataRaw;
							const providerId = `${course?.id}-${id}`; // append course id so that comments are unique in the query scope

							// if comment is valid
							if (
								!body?.includes('[deleted]') &&
								score >= 1 &&
								body?.length > 40 &&
								body?.includes(courseCode)
							) {
								const filteredParagraphs = body
									?.split('\n')
									?.filter((p) => p?.includes(courseCode))
									?.join('\n\n');

								const sentimentResult = await (
									await fetch('/api/sentiment', {
										method: 'POST',
										body: JSON.stringify({
											content: filteredParagraphs
										}),
										headers: {
											'content-type': 'application/json'
										}
									})
								)?.json();

								const commentData = {
									course: course?.id,

									content: filteredParagraphs,
									upvotes: score,
									helpful: 0,
									sentimentScore: sentimentResult?.documentSentiment?.score,
									sentimentMagnitude: sentimentResult?.documentSentiment?.magnitude,

									provider: 'reddit',
									providerId,
									providerData: commentDataRaw,
									providerUrl: `https://www.reddit.com${permalink}`,
									providerCreated: new Date(created_utc * 1000)
								};

								let comment;

								try {
									// try to create new comment
									comment = await pb.collection('comments').create(commentData);
								} catch (error) {
									// update existing comment
									// comment = await pb
									// 	.collection('comments')
									// 	.getFirstListItem(`providerId='${providerId}'`);
									// comment = await pb.collection('comments').update(comment?.id, commentData);
								}

								comments?.push(comment);
							}
						}

						return comments;
					}
				}
			});

			const commentGroups = await Promise.all(commentPromises);
			return commentGroups?.filter((group) => group)?.flat();
		});

		const savedComments = (await Promise.all(keywordPromises))
			?.flat()
			?.filter((comment) => comment);
		return savedComments;
	} catch (error) {}
};

export default getComments;
