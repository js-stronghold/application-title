define([
		'jquery',
		'underscore',
		'handlebars',
		'calendar/database',
		'interface/day-view',
		'interface/add-day',
		'extensions/date',
		'jquery-ui/draggable'
	],
	function($, _, Handlebars, DB, dayView, addDay) {
		$.fn.calendar = function() {
			var $selected = this;
			var currentDate = new Date();
			var daysFromDBforThisMonth = [];
			var daysFromCurrentMonth = [];

			var sorce = $('#calendar-template').html();
			var template = Handlebars.compile(sorce);

			var calendar = $('<div />');

			var leftBtn = $('<button />')
				.data('action', '-1')
				.html('&lt;');

			var rightBtn = $('<button />')
				.data('action', '1')
				.html('&gt;');

			var selectedMonth = $('<span />')
				.addClass('selected-month');

			var controls = $('<div />')
				.addClass('controls')
				.append(leftBtn)
				.append(selectedMonth)
				.append(rightBtn);

			var tooltip = $('<div />')
				.addClass('tooltip');

			$selected
				.append(controls)
				.append(calendar)
				.draggable();

			resetCalendarContent();

			function buildCalendar(date) {
				date = date || new Date();

				var CALENDAR_ROWS = 6;
				var WEEK_DAYS = [{
					name: 'Mon'
				}, {
					name: 'Tue'
				}, {
					name: 'Wed'
				}, {
					name: 'Thu'
				}, {
					name: 'Fri'
				}, {
					name: 'Sat',
					class: 'weekend'
				}, {
					name: 'Sun',
					class: 'weekend'
				}];

				var year = date.getFullYear();
				var month = date.getMonth();
				var rows = [];

				var firstDayOfMonth = new Date(year, month, 1);
				var firstDayOfMonthWeekDay = firstDayOfMonth.getDay();
				var lastDayOfMonth = new Date(firstDayOfMonth.setMonth(month + 1) - 1).getDate();

				var previousMonthRendered = false;
				var inNextMonth = false;
				var startNext = 0;
				var currentDayRendered = 1;

				daysFromDBforThisMonth = DB.getDaysForThisMonth(date);
				daysFromCurrentMonth = ['reserved'];

				(function() {
					var i,
						j,
						len,
						row,
						dayDate,
						currentData;

					for (i = 0; i < CALENDAR_ROWS; i += 1) {
						row = [];

						// previous month numbers
						if (!previousMonthRendered) {
							var previousMonthDays = firstDayOfMonthWeekDay;
							var previousFirstDayOfMonth = new Date(year, month - 1, 1);
							var previousMonthLastDay = new Date(previousFirstDayOfMonth.setMonth(month) - 1).getDate();
							var startIndex = previousMonthLastDay - previousMonthDays + 2;
							if (startIndex > previousMonthLastDay) {
								startIndex -= 7;
							}

							dayDate = new Date(year, month - 1, startIndex);

							for (j = startIndex, len = previousMonthLastDay; j <= len; j += 1) {
								currentData = {
									date: j,
									class: 'another-month'
								};

								if (dayDate.getDay() === 6 || dayDate.getDay() === 0) {
									currentData.class += ' weekend';
								}

								row.push(currentData);
								startNext += 1;

								dayDate.setDate(dayDate.getDate() + 1);
							}
							previousMonthRendered = true;
						}

						// current month numbers
						for (j = startNext, len = WEEK_DAYS.length; j < len; j += 1) {
							currentData = {
								date: currentDayRendered,
								class: 'current-month'
							};
							if (!inNextMonth) {
								daysFromCurrentMonth.push(currentData);
							} else {
								// next month numbers
								currentData.class = 'another-month';
							}

							if (dayDate.getDay() === 6 || dayDate.getDay() === 0) {
								currentData.class += ' weekend';
							}

							row.push(currentData);

							currentDayRendered += 1;

							if (currentDayRendered > lastDayOfMonth) {
								currentDayRendered = 1;
								inNextMonth = true;
							}

							dayDate.setDate(dayDate.getDate() + 1);
							startNext += 1;
						}
						rows.push(row);
						startNext = 0;
					}
				})();

				return {
					headers: WEEK_DAYS,
					calendarRows: rows
				};
			}

			function resetCalendarContent() {
				var result = buildCalendar(currentDate),
					referenceDate = new Date();
				highlightDaysWithContent(currentDate);
				setInnerMonth(currentDate);

				if (currentDate.getMonth() === referenceDate.getMonth() &&
					currentDate.getFullYear() === referenceDate.getFullYear()) {
					daysFromCurrentMonth[currentDate.getDate()].class += ' today';
				}

				calendar.html(template(result));
			}

			function removeDayFromContents(day) {
				DB.removeDay(day);
				resetCalendarContent();
			}

			controls.on('click', 'button', function() {
				var operation = parseInt($(this).data('action'));
				currentDate.setMonth(currentDate.getMonth() + operation);

				resetCalendarContent();
			});

			calendar.on('mouseover', 'td.current-month', function(evt) {
				var $this = $(this),
					monthDays = daysFromCurrentMonth,
					dayObject = monthDays[+$this.text()];

				tooltip.css({
					position: 'fixed',
					left: evt.pageX,
					top: evt.pageY,
				});

				if (dayObject.contents) {
					tooltip
						.html(dayObject.contents.contents.length + ' items');
				} else {
					tooltip.html('click to add content');
				}

				tooltip.appendTo($selected);
			});

			calendar.on('mouseleave', 'td.current-month', function() {
				tooltip.remove();
			});

			calendar.on('click', 'td.current-month', function(evt) {
				var $this = $(this),
					monthDays = daysFromCurrentMonth,
					referenceDate,
					dayObject = monthDays[+$this.text()];

				if (dayObject.contents && !dayObject.contents.isDisplayed) {
					dayView.init(dayObject.contents, $selected, evt.pageX, evt.pageY, $this, removeDayFromContents);
				}

				if (!dayObject.contents) {
					referenceDate = new Date(currentDate);
					referenceDate.setDate(+$this.text());
					addDay(referenceDate, $selected, evt.pageX, evt.pageY, $this, removeDayFromContents);
                    resetCalendarContent();
				}
			});

			$('body').on('keydown', function(evt) {
				var element,
					day;

                    if ($('.add-content-dialog').css('display') !== 'none') {
                        return;
                    }

				switch (evt.keyCode) {

					case 27:
						// Esc close last daily view
						element = $('.day-view:last-child');

						if (!element.length) {
							return;
						}

						day = element.data('day');
						element.data('remove')();
						break;

					case 37:
						// Left Arrow prev month
						element = $('#calendar-container .controls button:first-child');
						element.click();
						element.focus();
						break;

					case 38:
						// Up Arrow next year
						currentDate.setFullYear(currentDate.getFullYear() + 1);
						resetCalendarContent();
						break;

					case 39:
						// Right Arrow next month
						element = $('#calendar-container .controls button:last-child');
						element.click();
						element.focus();
						break;

					case 40:
						//Down Arrow prev year
						currentDate.setFullYear(currentDate.getFullYear() - 1);
						resetCalendarContent();
						break;

					default:
						break;
				}
			});

			function highlightDaysWithContent() {
				var days = daysFromDBforThisMonth;
				var currentMonthDays = daysFromCurrentMonth;
				_(days).each(function(day) {
					var i = day.number;
					currentMonthDays[i].class += ' highlighted';
					currentMonthDays[i].contents = day;
				});

				return currentMonthDays;
			}

			function setInnerMonth(date) {
				selectedMonth.text(date.getMonthName() + ' ' + date.getFullYear());
			}

			function setValue(date) {
				$this.val(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
			}

			return $selected;
		};
	});