define(['jquery', 'interface/add-content'], function($, addContent) {
	function create(day) {
		var wrapper,
			dayContent = $('<div />')
			.html(day.toDomElement()),
			addButton = $('<button />')
			.addClass('add-button')
			.html('Add more content'),
			closeButton = $('<button />')
			.addClass('close-button')
			.html('X');

		wrapper = $('<div />')
			.css('position', 'fixed')
			.addClass('day-view')
			.append(dayContent)
			.append(addButton)
			.append(closeButton);

		addButton.on('click', addContent.add);
		closeButton.on('click', function() {
			wrapper.remove();
			day.isDisplayed = false;
		});

		day.isDisplayed = true;

		return wrapper;
	}

	return {
		init: function(day, $selector, x, y) {
			var wrapper = create(day)
				.css({
					left: x,
					top: y
				});

			$selector.append(wrapper);
		},
	};
});