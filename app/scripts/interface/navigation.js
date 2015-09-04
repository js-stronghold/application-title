define('navigation', ['jquery', 'underscore', 'handlebars', 'calendar/database', 'extensions/date'],
	function($, _, Handlebars, database) {
		$.fn.fillnavigation = function() {
			var $this = this;
			var logger = {
				logged: false
			};

			var sorce = $('#navigation-template').html();
			var template = Handlebars.compile(sorce);

			var result = $(template(logger)).appendTo($this);

			var navContainer = $('#navigation-container')
			.css({
				'overflow': 'auto',
				'zoom': '1',
				'background-color': '#73AFB6',
				'color': '#ED1C24',
				'padding': '5px'
			});
			var leftFloated = $('.left')
			.css({
				'float': 'left',
				'padding': '3px'
			});
			var rightFloated = $('.right')
			.css({
				'float': 'right',
				'padding': '3px'
			});
			var home = $('#home')
			.addClass('item')
			.css({
				'position': 'relative',
			});


			if(logger.logged)
			{
				var logout = $('#logout')
				.addClass('log item')
				.click(logOut());

				var userCalender = $('#user-calendar')
				.addClass('item')
				.click(monthView());

			} else {
				var login = $('#login')
				.addClass('log item')
				.click(logInForm());

				var creatNew = $('#create-new-account')
				.addClass('item')
				.click(createNewAccount());
			}

			var items = $('.item')
			.css({
				'margin': '3px',
				'cursor': 'pointer'
			});

			function logOut() {
				//TODO
			}

			function monthView(){
				//TODO
			}

			function logInForm(){
				//TODO
			}

			function createNewAccount(){
				//TODO
			}
		};
	});