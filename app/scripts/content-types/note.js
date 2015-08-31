define(['content-types/content', 'jquery'], function(Content, $) {
function Note(title, message, time, color) {
	var TYPE = 'note';
		Content.call(this,
			title.title || title,
			TYPE,
			title.time || time,
			title.color || color);

		this.message = title.message || message;
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
		var noteText = $('<p />')
			.addClass('note')
			.html(this.message);

		var wrapper = Content.prototype.toDomElement.call(this)
			.append(noteText);

		return wrapper;
	}

	return Note;
});