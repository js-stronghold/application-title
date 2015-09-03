define(['interface/add-content', 'calendar/database', 'jquery', 'jquery-ui/draggable'], function(addContent, DB, $) {
	function create(day, controlElement) {
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
			});	

		addButton.on('click', addContent.add);

		removeButton.on('click', function() {
			wrapper.remove();

			if (day.contents.length === 0) {
				DB.removeDay(day);
				controlElement.removeClass('highlighted');
			} else {
				day.isDisplayed = false;
			}	
		});

		$(wrapper).find('.content .remove-button').on('click', function() {
			var $this = $(this),
				content = $this.data('content');

			day.removeContent(content);
			$this.parent().remove();

			if (day.contents.length === 0) {
				removeButton.click();
			}
		});

		day.isDisplayed = true;

		return wrapper;
	}

	return {
		init: function(day, $selector, x, y, controlElement) {
			var wrapper = create(day, controlElement)
				.css({
					left: x,
					top: y
				})
				.data('day', day);	

			$selector.append(wrapper);
		},
	};
});