define(['content-types/content', 'jquery'], function(Content, $) {
function Note(title, message, time) {
	var TYPE = 'note';
		Content.call(this,
			title.title || title,
			TYPE,
			title.time || time);

	this.message = title.message || message;
		
	Object.defineProperties(this, {
		message: {
			get: function() {
				return this._message;
			},
			set: function(val) {
				if(!val || typeof(val) !== 'string') {
					throw new Error('Note received invalid message not a string or empty');
				}
				
				this._message = val;
			},
			enumerable: true
		}
	});	
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
