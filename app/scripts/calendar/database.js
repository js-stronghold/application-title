define(['underscore'], function(_) {
	daysWithEvents = [];

	function getDaysForThisMonth(monthDate) {
		var days = _(daysWithEvents).filter(function(day) {
			return day.date.getMonth() === monthDate.getMonth();
		});

		return days;
	}

	function getDaysForPrevMonth(monthDate) {
		var month,
			year,
			prevMonth;

		if (monthDate.getMonth === 0) {
			month = 11;
			year = monthDate.getFullYear() - 1;
		} else {
			month = monthDate.getMonth() - 1;
			year = monthDate.getFullYear();
		}

		prevMonth = new Date(year, month, 1);

		return getDaysForThisMonth(prevMonth);
	}

	function getDaysForNextMonth(monthDate) {
		var month,
			year,
			nextMonth;

		if (monthDate.getMonth === 11) {
			month = 0;
			year = monthDate.getFullYear() + 1;
		} else {
			month = monthDate.getMonth + 1;
			year = monthDate.getFullYear();
		}

		nextMonth = new Date(year, month, 1);

		return getDaysForThisMonth(nextMonth);
	}

	function addDay(day) {
		if (!day.date || typeof(day.toDomElement) !== 'function') {
			throw new Error('addDay received invalid parameters, probably not a valid Day instance');
		}

		if (_(daysWithEvents).findIndex({date: day.date})) {
			throw new Error('The database already contain a Day with the same date');
		}

		daysWithEvents.push(day);
	}

	function removeDay(byDateOrbyReference) {
		if (byDateOrbyReference instanceof Date) {
			return removeDayByDate(byDateOrbyReference);
		} else if (byDateOrbyReference.date instanceof Date) {
			return removeDayByReference(byDateOrbyReference);
		} else {
			throw new Error('removeDay received invalid arguments');
		}
	}

	function removeDayByDate(date){
		var index = _(daysWithEvents).findIndex({date: date}),
			removedDay;

		if (index === -1) {
			return null;
		} else {
			removedDay = daysWithEvents[index];
			daysWithEvents.splice(index, 1);

			return removeDay;
		}
	}

	function removeDayByReference(day) {
		var index = _(daysWithEvents).indexOf(day),
			removedDay;

		if (index === -1) {
			return null;
		} else {
			removedDay = daysWithEvents[index];
			daysWithEvents.splcie(index, 1);

			return removeDay;
		}
	}

	return {
		getDaysForThisMonth: getDaysForThisMonth,
		getDaysForPrevMonth: getDaysForPrevMonth,
		getDaysForNextMonth: getDaysForNextMonth,
		addDay: addDay,
		removeDay: removeDay
	};
});