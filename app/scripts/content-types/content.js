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
		var title = $('<h3 />')
			.html(this.title);

		var wrapper = $('<div />')
			.addClass('content')
			.append(title);

		return wrapper;
	}

	return Content;
});