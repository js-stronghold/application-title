define(['calendar/database',
	'calendar/day',
	'content-types/note',
	'content-types/list',
	'calendar/calendar'
], function(db, day, note, list) {
	$('#calendar-container').calendar();

	DB = db;
	Day = day;
	Note = note;
	List = list;

	testDays = [];

	(function() {
		var day,
			month,
			year,
			selectedDate,
			currentDay,
			dayNote,
			dayList;

		for (year = 2013; year <= 2015; year += 1) {
			for (month = 0; month <= 11; month += 1) {
				for (day = 1; day < 30; day += 6) {

					selectedDate = new Date(year, month, day);
					currentDay = new Day(selectedDate);

					dayNote = new Note(currentDay.name,
						'kupih ' + currentDay.number + ' televizora');

					dayList = new List('igrachki', [
						'avtomat',
						'kantar',
						'triygylnik',
						'xlqb'
					]);

					currentDay
						.addContent(dayNote)
						.addContent(dayList);

					testDays.push(currentDay);
				}
			}
		}
	})();

	testDays.forEach(DB.addDay);

	// after you are done clear localStorage from the 
	// browser console (localStorage.clear())
	// or you will get errors 
});