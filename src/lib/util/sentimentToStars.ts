interface ISentimentToStars {
	sentimentScore: number;
	sentimentMagnitude: number;
}

const sentimentToStars = ({ sentimentScore, sentimentMagnitude }: ISentimentToStars): number => {
	const multiple = sentimentScore * sentimentMagnitude;
	const LIMIT_1 = -0.6;
	const LIMIT_2 = -0.1;
	const LIMIT_3 = 0.1;
	const LIMIT_4 = 1;

	if (multiple <= LIMIT_1) return 1;
	else if (LIMIT_1 <= multiple && multiple < LIMIT_2) return 2;
	else if (LIMIT_2 <= multiple && multiple < LIMIT_3) return 3;
	else if (LIMIT_3 <= multiple && multiple < LIMIT_4) return 4;

	return 5;
};

export default sentimentToStars;
