define(['interface/add-content', 'jquery', 'jquery-ui/draggable'], function(addContent, $) {
	function create(day, controlElement, removeCallback) {
		var wrapper,
			dayContent = $('<div />')
			.html(day.toDomElement()),
			addButton = $('<button />')
			.addClass('add-button')
			.html('Add more content'),
			removeButton = $('<button />')
			.addClass('remove-button')
			.html('X');

		wrapper = $('<div />')
			.css('position', 'fixed')
			.addClass('day-view')
			.append(dayContent)
			.append(addButton)
			.append(removeButton)
			.draggable({
				zIndex: 100,
				opacity: 0.85
			})
			.data('remove', remove);

		addContent(wrapper, dayContent, addButton, day);

		removeButton.on('click', remove);

		$(wrapper).find('.content .remove-button').on('click', function() {
			var $this = $(this),
				content = $this.data('content');

			day.removeContent(content);
			$this.parent().remove();

			if (day.contents.length === 0) {
				remove();
			}
		});

		function remove() {
			if (!wrapper) {
				return;
			}

			wrapper.remove();

			if (day.contents.length === 0) {
				controlElement.removeClass('highlighted');
				removeCallback(day);
			} else {
				day.isDisplayed = false;
			}
		}

		day.isDisplayed = true;

		return wrapper;
	}

	return {
		init: function(day, $selector, x, y, controlElement, removeCallback) {
			var wrapper = create(day, controlElement, removeCallback)
				.css({
					left: x,
					top: y
				})
				.data('day', day);	

			$selector.append(wrapper);
		},
	};
});