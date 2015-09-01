define('calendar', ['jquery', 'underscore', 'handlebars', 'calendar/database', 'extensions/date'],
	function($, _, Handlebars, database) {
		$.fn.calendar = function() {
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
				date = date || new Date();

				var CALENDAR_ROWS = 5;
				var WEEK_DAYS = [
					{name: 'Mon'},
					{name: 'Tue'},
					{name: 'Wed'},
					{name: 'Thu'},
					{name: 'Fri'},
					{name: 'Sat', class: 'weekend'},
					{name: 'Sun',class: 'weekend'}
				];

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
					month: date.getMonthName(),
					headers: WEEK_DAYS,
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