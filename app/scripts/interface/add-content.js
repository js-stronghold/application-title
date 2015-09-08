define([
	'content-types/note',
	'content-types/list',
	'service-communication/database-link',
	'jquery',
	'jquery-ui/jquery-ui'
], function(Note, List, DB, $) {
	function createForm(dayContent, actionButton, day) {
		var dialogWrapper = $('<div />'),
			form = $('<form />'),
			fieldset = $('<fieldset />'),
			pickContent = $('<select />'),
			inputTitle = $('<input />'),
			inputTime = $('<input />'),
			contentSpecific = $('<div />')
			.addClass('content-specific'),
			dialog,
			items = [],
			selectedType,
			contentTypes = {
				Note: Note,
				List: List
			};

		inputTitle.attr({
				tpye: 'text',
				name: 'content-title'
			})
			.addClass('text ui-widget-content ui-corner-all');

		inputTime.attr({
				type: 'text',
				name: 'content-time'
			})
			.addClass('text ui-widget-content ui-corner-all');

		pickContent
			.attr({
				name: 'pick-content'
			})
			.append('<option value="" disabled selected>Select Type</option>')
			.on('change', function() {
				selectedType = pickContent.val();
				contentSpecific.empty();
				addTypeSpecificContent(contentSpecific, selectedType);
			})
			.addClass('text ui-widget-content ui-corner-all');

		Object.keys(contentTypes).forEach(function(key) {
			var option = $('<option />')
				.attr('value', key)
				.text(key)
				.appendTo(pickContent);
		});

		fieldset
			.append(pickContent)
			.append('<label for="content-title">title</label>')
			.append(inputTitle)
			.append('<label for="content-time">time</label>')
			.append(inputTime)
			.append(contentSpecific)
			.append('<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">')
			.appendTo(form);

		dialogWrapper
			.append(form)
			.attr({
				title: 'Add New Content'
			})
			.dialog({
				autoOpen: false,
				width: 350,
				modal: true,
				dialogClass: 'add-content-dialog',
				buttons: {
					"Add Content": addContent,
					Cancel: function() {
						dialogWrapper.dialog("close");
					}
				},
				close: function() {
					$('.add-content-dialog').remove();

					actionButton.off('click');
				}
			});

		form
			.on("submit", function(evt) {
				evt.preventDefault();
				addContent();
			})
			.on('keydown', 'input,select', function(evt) {
				evt.stopPropagation();
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

			switch (selectedType) {
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

			DB.uploadToCloud(day);
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
						.addClass('text ui-widget-content ui-corner-all')
						.appendTo(container);
					break;
				case 'List':
					label
						.text('items')
						.appendTo(container);

					field
						.attr({
							type: 'text',
							name: 'content-items',
							title: 'Press enter to add item'
						})
						.addClass('items')
						.addClass('text ui-widget-content ui-corner-all')
						.on('keydown', function(evt) {

							if (evt.keyCode === 13) {
								evt.preventDefault();
								button.click();
							}
						})
						.tooltip({
							show: 'slideDown',
							hide: 'slideUp',
							position: {
								my: 'left top+15', at: 'left bottom-15'
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
						.css({
							position: 'absolute',
							right: '17px',
							bottom: '8px',
							width: '65px',
							'font-size': '12px',
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