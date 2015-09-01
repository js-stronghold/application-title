define('calendar', ['jquery', 'underscore', 'handlebars', 'calendar/database', 'extensions/date'],
	function($, _, Handlebars, database) {
		$.fn.calendar = function() {
			var WEEK_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

			var $this = this;
			var currentDate = new Date();
			var daysFromDB = [];
			var daysFromCurrentMonth = [];

			var sorce = $('#calendar-template').html();
			var template = Handlebars.compile(sorce);
			var calendar = buildCalendar();

			highlightDaysWithContent();
            var result = template(calendar);

            console.log(daysFromCurrentMonth);
            
			$this.append(result);

			function buildCalendar(date) {
				var CALENDAR_ROWS = 6;
				date = date || new Date();
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

				daysFromDB = database.getDaysForThisMonth(date);
                daysFromCurrentMonth = ['reserved'];

				(function() {
					var i,
						j,
						len,
						row,
						current;

					for (i = 0; i < CALENDAR_ROWS; i += 1) {
						row = [];

						// previous month numbers
						if (!previousMonthRendered) {
							var previousMonthDays = firstDayOfMonthWeekDay;
							var previousFirstDayOfMonth = new Date(year, month - 1, 1);
							var previousMonthLastDay = new Date(previousFirstDayOfMonth.setMonth(month) - 1).getDate();
							var startIndex = previousMonthLastDay - previousMonthDays + 1;
							if (startIndex > previousMonthLastDay) {
								startIndex -= 7;
							}

							for (j = startIndex, len = previousMonthLastDay; j <= len; j += 1) {
								current = {
									date: '',
									class: 'another-month'
								};
								row.push(current);
								startNext += 1;
							}
							previousMonthRendered = true;
						}

						// current month numbers
						for (j = startNext; j < 7; j += 1) {
							if (!inNextMonth) {
								current = {
									date: currentDayRendered,
									class: 'current-month'
								};
								row.push(current);
								daysFromCurrentMonth.push(current);
							} else {
								// next month numbers
								current = {
									date: '',
									class: 'another-month'
								};
								row.push(current);
							}

							currentDayRendered += 1;
							if (currentDayRendered > lastDayOfMonth) {
								currentDayRendered = 1;
								inNextMonth = true;
							}

							startNext += 1;
						}
						rows.push(row);
						startNext = 0;
					}
				})();

				return {
					month: date.getMonthName(),
					headers: WEEK_DAY_NAMES,
					calendarRows: rows
				};
			}

			// controls.on('click', 'button', function () {
			//     var operation = parseInt($(this).data('operation'));
			//     var date = new Date(currentDate.setMonth(currentDate.getMonth() + operation));
			//     buildCalendar(date);
			//     highlightDaysWithContent(date);
			//     setInnerMonth(date);
			// });

			// calendar.on('click', 'td.current-month', function () {
			//     var $this = $(this);
			//     //TODO :DailyView

			// });

			function highlightDaysWithContent() {
				var days = daysFromDB;
				var currentMonthDays = daysFromCurrentMonth;
				_(days).each(function(day) {
					var i = day.number;
					currentMonthDays[i].class += ' highlighted';
                    currentMonthDays[i].contents = day;
				});

                return currentMonthDays;
			}

			function setInnerMonth(date) {
				innerMonth.text(date.getMonthName() + ' ' + date.getFullYear());
			}

			function setValue(date) {
				$this.val(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
			}

			// append control to DOM
		};
	});