define('calendar', ['libs/jquery','libs/underscore','libs/handlebars''calendar/database', 'extensions/date'],
	function($, _, Handlebars, database) {
		 $.fn.calendar = function () {
        var WEEK_DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        var $this = this;
        var currentDate = new Date();

        var sorce = $('#calendar-template').html();
        var template = Handlebars.compile(sorce);
        var calendar = buildCalendar();
        var result = template(calendar);

        highlightDaysWithContent(currentDate);

        function buildCalendar(date) {
            var CALENDAR_ROWS = 6;
            date = date || new Date(); // this is correct
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

            for (var i = 0; i < CALENDAR_ROWS; i += 1) {
                var row = [];
                // previous month numbers
                if (!previousMonthRendered) {
                    var previousMonthDays = firstDayOfMonthWeekDay;
                    var previousFirstDayOfMonth = new Date(year, month - 1, 1);
                    var previousMonthLastDay = new Date(previousFirstDayOfMonth.setMonth(month) - 1).getDate();
                    var startIndex = previousMonthLastDay - previousMonthDays + 1;
                    if (startIndex > previousMonthLastDay) {
                        startIndex -= 7;
                    }

                    for (var j = startIndex, len = previousMonthLastDay; j <= len; j += 1) {
                        row.push({date: ''});
                        startNext += 1;
                    }
                    previousMonthRendered = true;
                }

                // current month numbers
                for (var j = startNext; j < 7; j += 1) {
                    if (!inNextMonth) {
                        row.push({date: currentDayRendered});
                    }
                    else {
                        // next month numbers
                        row.push({date: ''});
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


            return {
                month: month;
                headers: WEEK_DAY_NAMES;
                calendarRows: rows;

            };
        }

        controls.on('click', 'button', function () {
            var operation = parseInt($(this).data('operation'));
            var date = new Date(currentDate.setMonth(currentDate.getMonth() + operation));
            buildCalendar(date);
            highlightDaysWithContent(date);
            setInnerMonth(date);
        });

        calendar.on('click', 'td.current-month', function () {
            var $this = $(this);
            //TODO :DailyView
            
        });

        function highlightDaysWithContent(date){
        	var days = database.getDaysForThisMonth(date);
        	var currentMonthDays = $(calendar).find('.current-month');
            _(days).each(function(day) {
                var i = day.number - 1;
                $(currentMonthDays[i]).addClass('highlighted');
            });
        }

        function setInnerMonth(date) {
            innerMonth.text(date.getMonthName() + ' ' + date.getFullYear());
        }

        function setValue(date) {
            $this.val(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
        }

        // append control to DOM
    }
});