define([
		'./request',
		'calendar/day',
		'content-types/note',
		'content-types/list',
		'underscore',
		'jquery',
		'extensions/date'
	],
	function(request, Day, Note, List, _, $) {

		var daysWithEvents = [];

		function parseStorageContent(storage) {
			var daysToInit = storage; //JSON.parse(localStorage.getItem('daysWithEvents'));
			_(daysToInit).each(function(item) {
				var dayDate = new Date(item.date);
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

		function downloadFromCloud() {
			return request.GET('Days', {
				authorisation: 'Bearer ' + localStorage.getItem('access_token')
			}).then(function(res) {
				clearCurrentContents();
				parseStorageContent(res);
				console.log('content loaded');
			}).catch(console.log);
		}

		function uploadToCloud(day) {
			var prepared,
				requestOptions;

			if (day instanceof Day) {
				if (day.contents.length < 1) {
					return;
				}

				prepared = prepareForStorage(day);

				requestOptions = {
					contentType: 'application/json',
					authorisation: 'Bearer ' + localStorage.getItem('access_token'),
					filter: {
						date: day.date
					}	
				};

				request.GET('Days', requestOptions)
					.then(function(response) {
						requestOptions.data = prepared;

						if (response.length === 0) {
							delete requestOptions.filter;
							return request.POST('Days', requestOptions);
						} else {
							return request.PUT('Days', requestOptions);
						}
					})
					.then(function(response) {
						console.log('%cDay added/updated in database', 'color: green; font-style: italic');
					})
					.catch(function(err) {
						console.log(err);
					});
			} else {
				throw new Error('Invalid value for day');
			}
		}

		function prepareForStorage(day, stringify) {
			var prepared = {
				date: day.date,
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

			prepared = currentLocalStorageContent.replace(regExLastArrayBracket, preString + prepareForStorage(day, true) + ']');

			localStorage.setItem('daysWithEvents', prepared);
		}

		function updateLocalStorage() {
			var prepared = [];

			_(daysWithEvents).each(function(day) {
				prepared.push(prepareForStorage(day));
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
			uploadToCloud(day);
		}

		function removeDay(byDateOrReference) {
			var deleted;

			if (byDateOrReference instanceof Date) {
				deleted = removeDayByDate(byDateOrReference);
			} else if (byDateOrReference.date instanceof Date) {
				deleted = removeDayByReference(byDateOrReference);
			} else {
				throw new Error('removeDay received invalid arguments');
			}

			request.DELETE('Days', {
				authorisation: 'Bearer ' + localStorage.getItem('access_token'),
				filter: {date: deleted.date},
				contentType: 'application/json'
			})
			.then(function(res) {
				console.log('%cDay deleted from DB', 'color: orange; font-style: italic');
			})
			.catch(function(err) {
				console.log(err);
			});
		}

		function clearCurrentContents() {
			daysWithEvents = [];
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

				return removedDay;
			}
		}

		function searchContentsByTitle(title) {
			var found = _(daysWithEvents).filter(function(day) {
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
			searchContentsByTitle: searchContentsByTitle,
			downloadFromCloud: downloadFromCloud,
			uploadToCloud: uploadToCloud,
			// exposed for testing
			reloadFromLS: parseStorageContent,
			prepareForStorage: prepareForStorage
		};
	});