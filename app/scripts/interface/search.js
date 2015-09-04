define(['calendar/database', 'interface/day-view', 'jquery', 'underscore'], function(DB, dayView, $, _) {
	var foundObjects = [];

	function start() {
		var inputBox = $('#search')
			.on('keydown', function(evt) {
				var container,
					leftPos = 500,
					topPos = 50;
				// Enter
				// console.log(evt.keyCode);
				if (evt.keyCode === 13) {
					if (inputBox.val().length > 3) {
						// evt.preventDefault();
						container = $('#calendar-container');
						foundObjects = DB.searchContentsByTitle(inputBox.val());

						// day, $selector, x, y, controlElement, removeCallback
						_(foundObjects).each(function(day) {
							dayView.init(day, container, leftPos, topPos, inputBox, removeDayFromDB);
							leftPos += 25;
							topPos += 100;
						});
					} else {
						// Throw or nothing
					}
				}
			});
	}


	function removeDayFromDB(day) {
		DB.removeDay(day);
	}

	return start;
});