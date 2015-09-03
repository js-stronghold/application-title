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
						year: this.getFullYear()
					},
					formatted = formatDateString(replacements, separator);

				return formatted;
			},
			enumerable: true,
			configurable: true
		},

		toFullNameString: {
			value: function(separator) {
				var replacements = {
					dayName: this.getDayName(),
					dayNumber: this.getDate() > 10 ? this.getDate() : '0' + this.getDate(),
					month: this.getMonthName(),
					year: this.getFullYear()
				},
				pattern = '#{dayName} #{dayNumber} #{month} #{year}';
				formatted = formatDateString(replacements, separator, pattern);

				return formatted;
			},
			enumerable: true,
			configurable: true
		}
	});

	function formatDateString(replacements, separator, pattern) {
		pattern = pattern || '#{dayName} #{month} #{dayNumber} #{year}';
		var formatted = pattern.replace(/#{(\S+)}/g, function(match, prop) {
			return replacements[prop] || match;
		});

		if (separator) {
			formatted = formatted.replace(/[\s]/g, separator);
		}

		return formatted;
	}
	// ***************************************************************** 
});