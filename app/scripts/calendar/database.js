define(['calendar/day', 'content-types/note', 'content-types/list', 'underscore', 'extensions/date'], function(Day, Note, List, _) {
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
				item.date[2]);
			var day;

			if (indexOfDayFromDate(dayDate) === -1) {
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
				});

				daysWithEvents.push(day);
			}
		});
	}

	function prepareForLocalStorage(day, stringify) {
		var prepared = {
			date: [
				day.date.getFullYear(),
				day.date.getMonth(),
				day.date.getDate()
			],
			contents: []
		};

		_(day.contents).each(function(content) {
			prepared.contents.push(content);
		});

		if (stringify) {
			return JSON.stringify(prepared);
		} else {
			return prepared;
		}	
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

		prepared = currentLocalStorageContent.replace(regExLastArrayBracket, preString + prepareForLocalStorage(day, true) + ']');

		localStorage.setItem('daysWithEvents', prepared);
	}

	function updateLocalStorage() {
		var prepared = [];

		_(daysWithEvents).each(function(day) {
			prepared.push(prepareForLocalStorage(day));
		});

		localStorage.setItem('daysWithEvents', JSON.stringify(prepared));
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

		if (indexOfDayFromDate(day.date) !== -1) {
			throw new Error('The database already contains information for tihs day');
		}

		daysWithEvents.push(day);
		updateLocalStorage();
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
			index = indexOfDayFromDate(date),
			removedDay;

		if (index === -1) {
			return null;
		} else {
			removedDay = daysWithEvents[index];
			daysWithEvents.splice(index, 1);
			updateLocalStorage();

			return removedDay;
		}
	}

	function indexOfDayFromDate(date) {
		return _(daysWithEvents).findIndex(function(day) {
			return date.toShortString() === day.date.toShortString();
		});
	}

	function removeDayByReference(day) {
		var index = _(daysWithEvents).indexOf(day),
			removedDay;

		if (index === -1) {
			throw new Error('Could not find the day in database');
		} else {
			removedDay = daysWithEvents[index];
			daysWithEvents.splice(index, 1);
			updateLocalStorage();

			return removedDay;
		}
	}

	// for testing purpose
	function clearWithoutLS() {
		daysWithEvents = [];
	}

	function searchContentsByTitle(title) {
		var found = _(daysWithEvents).filter(function(day){
			return _(day.contents).some(function(content) {
				return content.title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
			});	
		});

		return found;
	}

	return {
		getDaysForThisMonth: getDaysForThisMonth,
		getDaysForPrevMonth: getDaysForPrevMonth,
		getDaysForNextMonth: getDaysForNextMonth,
		getAll: getAll,
		addDay: addDay,
		removeDay: removeDay,
		updateLocalStorage: updateLocalStorage,
		clear: clear,
		searchContentsByTitle: searchContentsByTitle,
		// exposed for testing
		reloadFromLS: parseLocalStorageContent,
		clearWithoutLS: clearWithoutLS
	};
});