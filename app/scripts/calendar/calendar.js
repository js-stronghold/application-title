define('calendar', ['jquery','underscore','calendar/database', 'extensions/date'],
	function($, _, database) {
		 $.fn.calendar = function () {
        var WEEK_DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        var $this = this;
        var currentDate = new Date();
        var wrapper = $this.parent();
        var picker = $this.addClass('datepicker').wrap(wrapper);

        var controls = $('<div />').addClass('controls').appendTo(picker);

        var leftBtn = $('<button />').addClass('btn btn-previous').text('<').attr('data-operation', '-1').appendTo(controls);
        var innerMonth = $('<div />').addClass('current-month').text(currentDate.getMonthName() + ' ' + currentDate.getFullYear()).appendTo(controls);
        var rightBtn = $('<button />').addClass('btn btn-next').text('>').attr('data-operation', '1').appendTo(controls);

        var calendar = buildCalendar().appendTo(picker);

        highlightDaysWithContent(currentDate);

        function buildCalendar(date) {
            var CALENDAR_ROWS = 6;
            date = date || new Date(); // this is correct
            var year = year || date.getFullYear(); // ?? this will always be date.getFullYear() because it starts with "var year"
            var month = month || date.getMonth(); // ?? same
            var calendar = $('<table />').addClass('calendar');
            var headerRow = $('<tr />').appendTo(calendar);
            for (var i = 0, len = WEEK_DAY_NAMES.length; i < len; i++) {
                $('<th />').text(WEEK_DAY_NAMES[i]).appendTo(headerRow);
            }

            var firstDayOfMonth = new Date(year, month, 1);
            var firstDayOfMonthWeekDay = firstDayOfMonth.getDay();
            var lastDayOfMonth = new Date(firstDayOfMonth.setMonth(month + 1) - 1).getDate();

            var previousMonthRendered = false;
            var inNextMonth = false;
            var startNext = 0;
            var currentDayRendered = 1;

            for (var i = 0; i < CALENDAR_ROWS; i += 1) {
                var row = $('<tr />').appendTo(calendar);
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
                        $('<td />').addClass('another-month').text(j).appendTo(row);
                        startNext += 1;
                    }
                    previousMonthRendered = true;
                }

                // current month numbers
                for (var j = startNext; j < 7; j += 1) {
                    var cell = $('<td />').text(currentDayRendered).appendTo(row);
                    if (!inNextMonth) {
                        cell.addClass('current-month');
                    }
                    else {
                        // next month numbers
                        cell.addClass('another-month');
                    }

                    currentDayRendered += 1;
                    if (currentDayRendered > lastDayOfMonth) {
                        currentDayRendered = 1;
                        inNextMonth = true;
                    }

                    startNext += 1;
                }

                startNext = 0;
            }

            return calendar;
        }

        controls.on('click', 'button', function () {
            var operation = parseInt($(this).data('operation'));
            var date = new Date(currentDate.setMonth(currentDate.getMonth() + operation));
            buildCalendar(date).replaceAll('.calendar');
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
        wrapper.append(picker);
    }
});