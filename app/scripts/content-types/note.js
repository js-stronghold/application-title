define(['content-types/content', 'jquery'], function(Content, $) {
	function Note(title, message, time) {
		var TYPE = 'note';

		Object.defineProperties(this, {
			message: {
				get: function() {
					return this._message;
				},
				set: function(val) {
					if (!val || typeof(val) !== 'string') {
						throw new Error('Note received invalid message not a string or empty');
					}

					this._message = val;
				},
				enumerable: true
			}
		});

		if (title.title) {
			Content.call(this, title.title, TYPE, title.time);
			this.message = title.message;
		} else {
			Content.call(this, title, TYPE, time);
			this.message = message;
		}
	}

	Note.prototype = Object.create(Content.prototype, {
		constructor: {
			value: Note,
			enumerable: true
		},

		toDomElement: {
			value: toDomElement,
			enumerable: true
		}
	});

	function toDomElement() {
		var description = $('<span />')
			.addClass('description')
			.text('note: ');

		var noteText = $('<p />')
			.addClass('note')
			.append(description)
			.append(this.message);

		var wrapper = Content.prototype.toDomElement.call(this)
			.append(noteText);

		return wrapper;
	}

	return Note;
});