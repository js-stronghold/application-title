define(['jquery'], function($) {
	function Content(title, time, color) {
		this.title = title;
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