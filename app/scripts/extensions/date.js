define(function() {
	var MONTH_NAMES = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],
		WEEK_DAY_NAMES = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];

	// ******************** Extensions *********************************
	Object.defineProperties(Date.prototype, {
		getMonthName: {
			value: function() {
				return MONTH_NAMES[this.getMonth()];
			},
			enumerable: true,
			configurable: true
		},

		getDayName: {
			value: function() {
				return WEEK_DAY_NAMES[this.getDay()];
			},
			enumerable: true,
			configurable: true
		},

		formatShort: {
			value: function(separator, trueToDisplayMonthAsWord) {
				var day = this.getDate(),
					month = monthName ? this.getMonthName() : this.getMonth() + 1,
					year = this.getFullYear();

				return day + separator + month + separator + year;
			},
			enumerable: true,
			configurable: true
		}
	});
	// ***************************************************************** 
});