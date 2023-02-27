import sentimentToStars from '$lib/util/sentimentToStars';

const average = (array) => array.reduce((a, b) => a + b) / array.length;

const averageStars = (comments): string => {
	if (!comments) return 0;
	const stars = comments?.map((comment) => {
		return comment?.provider === 'reddit'
			? sentimentToStars({
					sentimentScore: comment?.sentimentScore,
					sentimentMagnitude: comment?.sentimentMagnitude
			  })
			: comment?.stars;
	});
	return average(stars)?.toFixed(1);
};

export default averageStars;
