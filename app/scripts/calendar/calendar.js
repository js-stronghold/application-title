define('calendar', ["jquery"], 
	function($){
        function Calendar (){
            $('#main-container').calendar();
        }

         $.fn.calendar = function (){
            var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var WEEK_DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

            Date.prototype.getMonthName = function () {
                return MONTH_NAMES[this.getMonth()];
            };

            Date.prototype.getDayName = function () {
                return WEEK_DAY_NAMES[this.getDay()];
            };

            var $this = this;
            var now = new Date();
            var currentDate = new Date();
            var wrapper = $('<div />').addClass('datepicker-wrapper');
            $this.addClass('datepicker').wrap(wrapper);
            wrapper = $this.parent();

            var picker = $('<div />').addClass('datepicker-content').appendTo('#main-container');
            var controls = $('<div />').addClass('controls').appendTo(picker);

            var leftBtn = $('<button />').addClass('btn btn-previous').text('<').attr('data-operation', '-1').appendTo(controls);
            var innerMonth = $('<div />').addClass('current-month').text(currentDate.getMonthName() + ' ' + currentDate.getFullYear()).appendTo(controls);
            var rightBtn = $('<button />').addClass('btn btn-next').text('>').attr('data-operation', '1').appendTo(controls);

            var calendar = buildCalendar().appendTo(picker);

            function buildCalendar(date) {
                var CALENDAR_ROWS = 6;
                date = date || new Date();
                var year = year || date.getFullYear();
                var month = month || date.getMonth();
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

                for (var i = 0; i < CALENDAR_ROWS; i++) {
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

                    for (var j = startIndex, len = previousMonthLastDay; j <= len; j++) {
                        $('<td />').addClass('another-month').text(j).appendTo(row);
                        startNext++;
                    }
                    previousMonthRendered = true;
                }

                for (var j = startNext; j < 7; j++) {
                    var cell = $('<td />').text(currentDayRendered).appendTo(row);
                    if (!inNextMonth) {
                        cell.addClass('current-month');
                    }
                    else {
                        cell.addClass('another-month');
                    }

                    currentDayRendered++;
                    if (currentDayRendered > lastDayOfMonth) {
                        currentDayRendered = 1;
                        inNextMonth = true;
                    }

                    startNext++;
                }

                startNext = 0;
            }
            console.log(calendar);
            return calendar;
        };
    }
    return Calendar;
})