const dateToSemesterKey = (date: Date) => {
	const semester = date?.getMonth() < 7 ? 'SP' : 'FA';
	const year = String(date?.getFullYear())?.slice(2, 4);
	return semester + year;
};

export default dateToSemesterKey;
