define([
	'content-types/note',
	'content-types/list',
	'calendar/database',
	'jquery',
	'jquery-ui/jquery-ui'
], function(note, list, DB, $) {
	function createForm($parent, dayContent, actionButton, day) {
		var dialogWrapper = $('<div />'),
			form = $('<form />'),
			pickContent = $('<select />'),
			inputTitle = $('<input />'),
			inputTime = $('<input />'),
			contentSpecific = $('<div />')
				.addClass('content-specific'),
			dialog,
			items = [],
			selectedType,
			contentTypes = {
				Note: note,
				List: list
			};

		inputTitle.attr({
			tpye: 'text',
			name: 'content-title'
		});

		inputTime.attr({
			type: 'text',
			name: 'content-time'
		});

		pickContent
			.attr({
				name: 'pick-content'
			})
			.append('<option value="" disabled selected>Select Type</option>')
			.on('change', function() {
				selectedType = pickContent.val();
				contentSpecific.empty();
				addTypeSpecificContent(contentSpecific, selectedType);
			});

		Object.keys(contentTypes).forEach(function(key) {
			var option = $('<option />')
				.attr('value', key)
				.text(key)
				.appendTo(pickContent);
		});

		form
			.append(pickContent)
			.append('<label for="content-title">title</label>')
			.append(inputTitle)
			.append('<label for="content-time">time</label>')
			.append(inputTime)
			.append(contentSpecific)
			.appendTo(dialogWrapper);

		dialogWrapper
			.attr({
				title: 'Add New Content'
			})
			.dialog({
				autoOpen: false,
				height: 300,
				width: 350,
				modal: true,
				buttons: {
					"Add Content": addContent,
					Cancel: function() {
						dialogWrapper.dialog("close");
					}
				},
				close: function() {
					dialogWrapper.dialog('destroy');
					actionButton.off('click');
					$parent.remove(dialogWrapper);
				}
			});

		form.on("submit", function(event) {
			addContent();
			event.preventDefault();
		});

		actionButton.button().on("click", function() {
			dialogWrapper.dialog("open");
		});

		function addContent() {
			var values = {
				tpye: pickContent.val(),
				title: inputTitle.val(),
				time: inputTime.val()
			};

			console.log('Add');

			switch(selectedType) {
				case 'Note': 
					values.message = contentSpecific.find('input').val();
					day.addContent(new Note(values));
					break;
				case 'List': 
					values.items = items;
					day.addContent(new List(values));
					break;
				default:
					throw new Error('Type not set or unknown');	
			}

			DB.updateLocalStorage();
			dayContent.html(day.toDomElement());
			dialogWrapper.dialog("close");
		}

		function addTypeSpecificContent(container, type) {
		var button = $('<span />'),
			label = $('<label />'),
			field = $('<input />');

		switch (type) {
			case 'Note':
				label
					.text('message')
					.appendTo(container);

				field
					.attr({
						type: 'text',
						name: 'content-message'
					})
					.addClass('message-box')
					.appendTo(container);
				break;
			case 'List':
				label
					.text('items')
					.appendTo(container);

				field
					.attr({
						type: 'text',
						name: 'content-items'
					})
					.addClass('items')
					.on('keydown', function(evt) {
						
						if (evt.keyCode === 13) {
							evt.preventDefault();
							button.click();
						}
					})
					.appendTo(container);

				button
					.text('Add')
					.button()
					.on('click', function() {
						items.push(field.val());
						field.val('');
					})
					.appendTo(container);
				break;
			default: 
				break;	
		}
	}
	}

	return createForm;
});