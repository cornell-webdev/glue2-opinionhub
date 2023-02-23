import { pb } from '$lib/glue/pocketbase';
import axios from 'axios';

interface IScrapeCommentsByQuery {
	queryString: string;
	sort: 'recent' | 'upvotes';
}

const sortComments = ({ comments, sort }) => {
	switch (sort) {
		case 'recent': {
			return comments?.sort((a, b) => {
				const aTime = new Date(a?.providerCreated)?.getTime();
				const bTime = new Date(b?.providerCreated)?.getTime();
				return bTime - aTime;
			});
		}

		case 'upvotes': {
			return comments?.sort((a, b) => {
				const bScore = b?.helpful * 30 + b?.upvotes;
				const aScore = a?.helpful * 30 + a?.upvotes;
				return bScore - aScore;
			});
		}
	}
};

const getCourseCode = (queryString: string): string => {
	const numberMatch = queryString.match(/\d+/);
	if (numberMatch && numberMatch?.length > 0) {
		return numberMatch[0];
	}
	return '';
};

const scrapeCommentsByQueryString = async ({ queryString, sort }: IScrapeCommentsByQuery) => {
	queryString = queryString?.trim()?.toLowerCase();
	if (!queryString) return null;

	try {
		// try returning existing query data
		const query = await pb.collection('queries').getFirstListItem(`queryString='${queryString}'`);
		const comments = await pb.collection('comments').getFullList(200, {
			filter: `query="${query?.id}"`
		});
		return {
			query,
			comments: sortComments({ comments, sort })
		};
	} catch (error) {
		const query = await pb.collection('queries').create({
			queryString
		});

		// scrape new query query data
		const { data } = await axios(
			`https://www.reddit.com/r/Cornell/search/.json?q=${encodeURIComponent(
				queryString
			)}&limit=30&restrict_sr=1&sr_nsfw=`
		);

		// for each question post, get comments
		const commentPromises = data?.data?.children?.map(async ({ data }) => {
			const { selftext: postContent, title: postTitle, permalink } = data;

			if (
				(postContent?.toLowerCase()?.includes(queryString) ||
					postTitle?.toLowerCase()?.includes(queryString)) &&
				(postContent?.includes('?') || postTitle?.includes('?'))
			) {
				const { data: postData } = await axios.get(`https://www.reddit.com${permalink}.json`);
				const questionRawData = postData[0]?.data?.children[0]?.data;
				const { media_metadata } = questionRawData;

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
						const providerId = `${query?.id}-${id}`; // append query id so that comments are unique in the query scope

						const courseCode = getCourseCode(queryString);
						const filterKeyword = courseCode || queryString;

						// if comment is valid
						if (
							!body?.includes('[deleted]') &&
							score >= 1 &&
							body?.length > 40 &&
							body?.includes(filterKeyword)
						) {
							const commentData = {
								query: query?.id,

								content: body,
								upvotes: score,
								helpful: 0,

								provider: 'reddit',
								providerId,
								providerData: commentDataRaw,
								providerUrl: `https://www.reddit.com${permalink}`,
								providerCreated: new Date(created_utc * 1000)
							};

							let comment;

							try {
								// try update existing comment
								comment = await pb
									.collection('comments')
									.getFirstListItem(`providerId='${providerId}'`);
								comment = await pb.collection('comments').update(comment?.id, commentData);
							} catch (error) {
								// create new comment
								comment = await pb.collection('comments').create(commentData);
							}

							comments?.push(comment);
						}
					}

					return comments;
				}
			}
		});

		const commentGroups = await Promise.all(commentPromises);
		const comments = commentGroups?.filter((group) => group)?.flat();

		return {
			query,
			comments: sortComments({ comments, sort })
		};
	}
};

export default scrapeCommentsByQueryString;
