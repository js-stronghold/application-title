define(['calendar/day', 'content-types/note', 'content-types/list', 'underscore'], function(Day, Note, List, _) {
	var daysWithEvents = [],
		daysToInit;

	if (localStorage.getItem('daysWithEvents')) {
		parseLocalStorageContent();
	}

	function parseLocalStorageContent() {
		var daysToInit = JSON.parse(localStorage.getItem('daysWithEvents'));
		_(daysToInit).each(function(item) {
			var dayDate = new Date(
				item.date[0], 
				item.date[1],
				item.date[2]),
				day = new Day(dayDate);

			_(item.contents).each(function(content) {
				var convertedToContent;

				switch (content.type) {
					case 'note':
						convertedToContent = new Note(content);
						break;
					case 'list':
						convertedToContent = new List(content);
						break;
					default:
						throw new Error('parseToLocalStorage received unknown content type ' + content.type);
				}

				day.addContent(convertedToContent);
				addDay(day);
			});
		});
	}

	function prepareForLocalStorage(day) {
		var objectForStringify = {
			date: [
				day.date.getFullYear(),
				day.date.getMonth(),
				day.date.getDate()
			],
			contents: []
		};

		_(day.contents).each(function(content) {
			objectForStringify.contents.push(content);
		});

		return JSON.stringify(objectForStringify);
	}

	function appendToLocalStorage(day) {
		var prepared,
			currentLocalStorageContent = localStorage.getItem('daysWithEvents'),
			regExLastArrayBracket = /\]$/,
			preString = ',';

		if (!currentLocalStorageContent) {
			localStorage.setItem('daysWithEvents', '[]');
			currentLocalStorageContent = '[]';
			preString = '';
		}

		prepared = currentLocalStorageContent.replace(regExLastArrayBracket, preString + prepareForLocalStorage(day) + ']');

		localStorage.setItem('daysWithEvents', prepared);
	}

	function getDaysForThisMonth(monthDate) {
		var days = _(daysWithEvents).filter(function(day) {
			return day.date.getMonth() === monthDate.getMonth() &&
				day.date.getFullYear() === monthDate.getFullYear();
		});

		return days;
	}

	function getDaysForPrevMonth(monthDate) {
		var month,
			year,
			prevMonth;

		if (monthDate.getMonth() === 0) {
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

		if (monthDate.getMonth() === 11) {
			month = 0;
			year = monthDate.getFullYear() + 1;
		} else {
			month = monthDate.getMonth() + 1;
			year = monthDate.getFullYear();
		}

		nextMonth = new Date(year, month);

		return getDaysForThisMonth(nextMonth);
	}

	function getAll() {
		return daysWithEvents.slice();
	}

	function addDay(day) {
		if (!day.date || typeof(day.toDomElement) !== 'function') {
			throw new Error('addDay received invalid parameters, probably not a valid Day instance');
		}

		if (_(daysWithEvents).findIndex({
				date: day.date
			}) !== -1) {
			return null;
		}

		daysWithEvents.push(day);
		appendToLocalStorage(day);
	}

	function removeDay(byDateOrReference) {
		if (byDateOrReference instanceof Date) {
			return removeDayByDate(byDateOrReference);
		} else if (byDateOrReference.date instanceof Date) {
			return removeDayByReference(byDateOrReference);
		} else {
			throw new Error('removeDay received invalid arguments');
		}
	}

	function clear() {
		daysWithEvents = [];
		localStorage.removeItem('daysWithEvents');
	}

	function removeDayByDate(date) {
		var dayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()),
			index = _(daysWithEvents).findIndex(function(day) {
				return dayDate.toDateString() === day.date.toDateString();
			}),
			removedDay;

		if (index === -1) {
			return null;
		} else {
			removedDay = daysWithEvents[index];
			daysWithEvents.splice(index, 1);

			return removedDay;
		}
	}

	function removeDayByReference(day) {
		var index = _(daysWithEvents).indexOf(day),
			removedDay;

		if (index === -1) {
			return null;
		} else {
			removedDay = daysWithEvents[index];
			daysWithEvents.splice(index, 1);

			return removedDay;
		}
	}

	return {
		getDaysForThisMonth: getDaysForThisMonth,
		getDaysForPrevMonth: getDaysForPrevMonth,
		getDaysForNextMonth: getDaysForNextMonth,
		getAll: getAll,
		addDay: addDay,
		removeDay: removeDay,
		clear: clear,
		// exposed for testing
		reloadFromLocal: parseLocalStorageContent
	};
});