define(['content-types/note', 'content-types/list', 'jquery', 'extensions/date'], function(Note, List, $) {

	function Day(date) {
		this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		Object.defineProperties(this, {
			number: {
				get: function() {
					return this.date.getDate();
				},
				enumerable: true
			},

			name: {
				get: function() {
					return this.date.getDayName();
				},
				enumerable: true
			},

			_contents: {
				value: []
			},

			_isHighlighted: {
				value: false,
				writable: true
			},

			_isDisplayed: {
				value: false,
				writable: true
			}
		});
	}

	Object.defineProperties(Day.prototype, {
		date: {
			get: function() {
				return this._date;
			},
			set: function(val) {
				// Validate
				this._date = val;
			},
			enumerable: true
		},

		contents: {
			get: function() {
				return this._contents.slice();
			},
			enumerable: true
		},

		isHighlighted: {
			get: function() {
				return this._isHighlighted;
			},
			enumerable: true
		},

		isDisplayed: {
			get: function() {
				return this._isDisplayed;
			},

			set: function(val) {
				this._isDisplayed = val;
			},
			enumerable: true
		},

		addContent: {
			value: addContent,
			enumerable: true
		},

		removeContent: {
			value: removeContent,
			enumerable: true
		},

		toDomElement: {
			value: toDomElement,
			enumerable: true
		}
	});

	function addContent(content) {
		// validation
		this._contents.push(content);
		this._isHighlighted = true;

		return this;
	}

	function removeContent(content) {
		var index = this._contents.indexOf(content),
			removedContent;

		if (index !== -1) {
			this._contents.splice(index, 1);

			if (this.contents.length === 0) {
				this._isHighlighted = false;
			}

			return content;

		} else {
			return null;
		}
	}

	function toDomElement() {
		var title = $('<h2 />')
			.addClass('date')
			.html(this.date.toFullNameString());

		var wrapper = $('<div />')
			.addClass('day')
			.append(title);

		this.contents.forEach(function(content) {
			wrapper.append(content.toDomElement());
		});

		return wrapper;
	}

	function parseDayNumber(number) {
		var numberToString = number.toString(),
			digit;

		if (numberToString.length === 1) {
			return number + getNumberEnding(number);
		}

		if (number === 11 || number === 12 || number === 13) {
			return number + 'th';
		}

		if (numberToString.length === 2) {
			digit = numberToString.substr(1, 1);
			return number + getNumberEnding(+digit);
		} else {
			throw new Error('Only 2 digit numbers accepted');
		}
	}

	function getNumberEnding(number) {
		if (number === 1) {
			return 'st';
		}

		if (number === 2) {
			return 'nd';
		}

		if (number === 3) {
			return 'rd';
		}

		return 'th';
	}

	return Day;
});