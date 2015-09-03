define(['jquery'], function($) {
	function Content(title, type, time, color) {
		this.title = title;
		this.type = type || null;
		this.time = time || null;
		this.color = color || null;
	}

	Object.defineProperties(Content.prototype, {
		toDomElement: {
			value: toDomElement,
			enumerable: true
		}
	});

	function toDomElement() {
		var type = $('<h3 />')
			.addClass('type')
			.text(this.type);

		var title = $('<h3 />')
			.addClass('title')
			.text(this.title);
			
		var description = $('<span />')
			.addClass('description')
			.text('title: ')
			.prependTo(title);

		var removeButton = $('<button />')
			.addClass('remove-button')
			.data('content', this)
			.text('X');

		var wrapper = $('<div />')
			.addClass('content')
			.append(removeButton)
			.append(type)
			.append(title);

		return wrapper;
	}

	return Content;
});