define(['calendar/day', 'interface/day-view', 'calendar/database', 'jquery', 'jquery-ui/draggable'], function(Day, dayView, DB, $) {
	function addDay(date, $selector, x, y, controlElement, removeCallback) {
		var day = new Day(date);
		controlElement.addClass('highlighted');

		dayView.init(day, $selector, x, y, controlElement, removeCallback);
		DB.addDay(day);
	}

	return addDay;
});