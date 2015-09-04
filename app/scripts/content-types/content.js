define(['jquery'], function($) {
	function Content(title, type, time) {
	this.title = title;
	this.type = type || null;
	this.time = time || null;
		
	Object.defineProperties(this, {
		type: {
			get: function() {
				return this._type;
			},	
			set: function(val) {
				if(typeOf(val) !== 'string' || val !== null ){
					throw new Error('Contenet type is invalid');
				}
				this._type = val;
			},
			enumerable: true
		},
		
		title: {
			get: function() {
				return this._title;
			},	
			set: function(val) {
				if(!val) {
					throw new Error('Title cannot be empty or undefined');
				}
				
				this._title = val;
			},
			enumerable:true
		},
		
		time: {
			get: function() {
				return this._time;
			},	
			set: function(val) {
				if (val !== null) {
					if(val.length <= 5) {
						throw new Error('Invalid time format: supported are 16:00 or 16 00 or 16h.');
						this._time = val;
					}	
				} else {
					this._time = null;
				}
			},
			enumerable: true
		}
	});
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
