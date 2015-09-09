define([
	'service-communication/database-link',
	'service-communication/request',
	'./day-view',
	'jquery',
	'underscore'
], function(DB, request, dayView, $, _) {
	var foundObjects = [];

	function apply($searchField) {
		$searchField
			.on('keydown', function(evt) {
				var container,
					searchData,
					filterContent;

				// Enter key
				if (evt.keyCode === 13) {
					if ($searchField.val().length > 3) {
						console.log('%cSearching...', 'color: blue; font-weight: bold');
						evt.preventDefault();
						container = $('#calendar-container');

						searchData = getPattern($searchField.val());
						filterContent = createFilter(searchData);

						request.GET('Days', {
								authorisation: 'Bearer ' + localStorage.getItem('access_token'),
								filter: filterContent
							})
							.then(function(res) {
								if (res.length > 0) {
									console.log('%cFound Something', 'color: green; font-weight: bold');
									console.log(res);
									displayResult(res, container);
								} else {
									console.log('%cNo souch thing in there...', 'color: gray; font-style: italic');
								}
								console.log('%c...Search ended.', 'color:blue; font-weight: bold');
							})
							.catch(function(err) {
								console.log('search error');
								throw err;
							});
					} else {
						// Throw or nothing
					}
				}
			});
	}

	function getPattern(value) {
		var separatorIndex,
			field,
			data,
			result = {};

		separatorIndex = value.indexOf(':');

		if (separatorIndex > -1) {
			field = value.substring(0, separatorIndex + 1);
			result.field = field;
		}

		data = value.substring(separatorIndex + 1);
		result.contains = data;

		return result;
	}

	function createFilter(obj) {
		var result = {};

		if (obj.field && obj.contains) {
			result[obj.field] = {
				'$regex': obj.contains
			};
		} else if (obj.contains) {
			result.contents = {
				'$elemMatch': {
					'title': {
						'$regex': obj.contains
					}
				}
			};
		} else {
			// To be...
		}

		return result;
	}

	function displayResult(data, container) {
		var leftPos = 500,
			topPos = 50,
			days = DB.parseStorageContent(data);
		
		_(days).each(function(day) {
			// day, $selector, x, y, controlElement, removeCallback
			dayView.init(day, container, leftPos, topPos, container, removeDayFromDB);
			leftPos += 25;
			topPos += 100;
		});
	}

	function removeDayFromDB(day) {
		DB.removeDay(day.date);
	}

	return apply;
});