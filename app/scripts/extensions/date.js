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

		toShortString: {
			value: function(separator) {
				var replacements = {
						dayName: this.getDayName().substr(0, 3),
						dayNumber: this.getDate() > 10 ? this.getDate() : '0' + this.getDate(),
						month: this.getMonthName().substr(0, 3),
						year: this.getFullYear(),
					},
					strFormat = '#{dayName} #{month} #{dayNumber} #{year}',
					formatted;

				formatted = strFormat.replace(/#{(\S+)}/g, function(match, prop) {
					return replacements[prop] || match;
				});

				if (separator) {
					formatted = formatted.replace(/[\s]/g, separator);
				}

				return formatted;
			},
			enumerable: true,
			configurable: true
		}
	});
	// ***************************************************************** 
});