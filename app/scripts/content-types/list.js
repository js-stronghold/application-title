define(['content-types/content', 'jquery'], function(Content, $) {
	function List(title, list, time, color) {
		Content.call(this, title, time, color);
		// list should be an array;
		this.items = list;
	}

	List.prototype = Object.create(Content.prototype, {
		constructor: {
			value: List,
			enumerable: true
		},

		toDomElement: {
			value: toDomElement,
			enumerable: true
		}
	});

	function toDomElement() {
		var list = $('<ul />')
			.addClass('list');

		parseContent(list, this.items);

		var wrapper = Content.prototype.toDomElement.call(this)
			.append(list);

		return wrapper;
	}

	function parseContent(list, content) {
		content.forEach(function(item) {
			var li = $('<li />')
				.html(item);

			list.append(li);
		});
	}

	return List;
});