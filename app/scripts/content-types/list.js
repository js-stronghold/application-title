define(['content-types/content', 'jquery'], function(Content, $) {
function List(titleOrParams, items, time) {
	var TYPE = 'list';
		if (typeof(titleOrParams) === 'object') {
			Content.call(
				this, 
				titleOrParams.title, 
				TYPE, 
				titleOrParams.time);

			this.items = titleOrParams.items;		
		} else {
			Content.call(this, titleOrParams, TYPE, time);
			// list should be an array;
			this.items = items;
		}
		
		Object.defineProperties(this, {
			items: {
				get: function() {
					return this._items;
				},
				
				set: function(val) {
					if(Array.isArray(val)) {
						this._items = val;
					} else {
						throw new Error('The list received invalid value for items, must be an array');
					}
				},
				enumerable: true
			}
		});
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
			if(!item) {
				throw new Error('Invalid value in List\'s items content');
			}
			
			var li = $('<li />')
				.html(item);

			list.append(li);
		});
	}

	return List;
});
