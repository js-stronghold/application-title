define('calendar', ['jquery', 'underscore', 'handlebars', 'calendar/database', 'interface/day-view', 'extensions/date'],
	function($, _, Handlebars, database, dayView) {
		$.fn.calendar = function() {
			var $selected = this;
			var currentDate = new Date();
			var daysFromDB = [];
			var daysFromCurrentMonth = [];

			var sorce = $('#calendar-template').html();
			var template = Handlebars.compile(sorce);
			var result = buildCalendar();

			highlightDaysWithContent();
			var calendar = $(template(result));

            var leftBtn = $('<button />')
                .data('action', '-1')
                .html('&lt;');

            var rightBtn = $('<button />')   
                .data('action', '1')
                .html('&gt;');

            var selectedMonth = $('<span />')
                .addClass('selected-month');
                
            setInnerMonth(currentDate);
                
            var controls = $('<div />')
                .addClass('controls')
                .append(leftBtn)
                .append(selectedMonth)
                .append(rightBtn);

			console.log(daysFromCurrentMonth);

			$selected
                .append(controls)
                .append(calendar);

            var popup = $('<div />')
                .addClass('popup');

			function buildCalendar(date) {
				date = date || new Date();

				var CALENDAR_ROWS = 6;
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
					headers: WEEK_DAYS,
					calendarRows: rows
				};
			}

			controls.on('click', 'button', function () {
			    var operation = parseInt($(this).data('action'));
			    var date = new Date(currentDate.setMonth(currentDate.getMonth() + operation));
			    var result = buildCalendar(date);
			    highlightDaysWithContent(date);
                calendar.html(template(result   ));
			    setInnerMonth(date);
			});

            calendar.on('mouseover', 'td.current-month', function(evt) {
                var $this = $(this),
                    monthDays = daysFromCurrentMonth,
                    dayObject = monthDays[+$this.text()];
                    if (dayObject.contents) {
                        popup
                            .appendTo($selected)
                            .html(dayObject.contents.contents.length + ' items')
                            .css({
                                position: 'fixed',
                                left: evt.pageX,
                                top: evt.pageY,
                            });
                    } 
            });

            calendar.on('mouseleave', 'td.current-month', function() {
                popup.remove();
            });

            calendar.on('click', 'td.current-month', function(evt) {
                var $this = $(this),
                    monthDays = daysFromCurrentMonth,
                    dayObject = monthDays[+$this.text()];

                if (dayObject.contents && !dayObject.contents.isDisplayed) {
                    dayView.init(dayObject.contents, $selected, evt.pageX, evt.pageY);
                }

                if (!dayObject.contents) {
                    console.log('Do you want to add content?');
                }
            });

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
				selectedMonth.text(date.getMonthName() + ' ' + date.getFullYear());
			}

			function setValue(date) {
				$this.val(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
			}

			// append control to DOM
		};
	});