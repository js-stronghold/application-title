define(['content-types/note', 'content-types/list', 'jquery', 'extensions/date'], function(Note, List, $) {

	function Day(date) {
		this.number = date.getDate();
		this.name = date.getDayName();

		Object.defineProperties(this, {
			_contents: {
				value: []
			},
			_isHighlighted: {
				value: false,
				writable: true
			}
		});
	}

	Object.defineProperties(Day.prototype, {
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
			.html(this.name + ' ' + parseDayNumber(this.number));

		var wrapper = $('<div />')
			.addClass('day')
			.append(title);

		this.contents.forEach(function(content) {
			var element = content.toDomElement();
			element.appendTo(wrapper);
		});

		return wrapper;
	}

	function parseDayNumber(number) {
		var numberToString = number.toString(),
			digit;

		if (numberToString.length === 1) {
			return number + getNumberEnding(number);
		}

		if (numberToString.length === 2) {
			digit = numberToString.substr(1, 1);
			return number + getNumberEnding(+digit);
		}

		else {
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