define('day', ['content-types/note', 'content-types/list'], function(Note, List) {

	function Day(number) {
		this.number = number;

		Object.defineProperties(this, {
			_contents: {
				value: []
			},
		});
	}

	Object.defineProperties(Day.prototype, {
		contents: {
			get: function() {
				return this._contents.slice();
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
		}
	});

	function addContent(content) {
		// validation
		this._contents.push(content);

		return this;
	}

	function removeContent(content) {
		var index = this._contents.indexOf(content);

		if (index !== -1) {
			return this._contents.splice(index, 1);
		} else {
			return null;
		}
	}

	return Day;
});