define(['jquery'], function($) {
	function Content(title, type, time) {
		this.title = title;
		this.type = type || null;
		this.time = time || null;
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
			
		var titleDescription = $('<span />')
			.addClass('description')
			.text('title: ')
			.prependTo(title);

		var time = $('<h3 />')
			.addClass('time')
			.text(this.time);

		var timeDescription = $('<sapn />')	
			.addClass('description')
			.text('time: ')
			.prependTo(time);

		var removeButton = $('<button />')
			.addClass('remove-button')
			.data('content', this)
			.text('X');

		var wrapper = $('<div />')
			.addClass('content')
			.append(removeButton)
			.append(type)
			.append(title);

		if (this.time) {
			time.appendTo(wrapper);
		}

		return wrapper;
	}

	return Content;
});