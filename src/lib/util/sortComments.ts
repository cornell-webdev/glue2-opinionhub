const sortComments = ({ comments, sort }) => {
	switch (sort) {
		case 'recent': {
			return comments?.sort((a, b) => {
				const aTime = new Date(a?.providerCreated || a?.created)?.getTime();
				const bTime = new Date(b?.providerCreated || b?.created)?.getTime();
				return bTime - aTime;
			});
		}

		case 'helpful': {
			return comments?.sort((a, b) => {
				const bScore = b?.helpful * 30 + b?.upvotes;
				const aScore = a?.helpful * 30 + a?.upvotes;
				return bScore - aScore;
			});
		}
	}
};

export default sortComments;
