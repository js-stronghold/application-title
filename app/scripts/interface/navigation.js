define([
		'jquery',
		'underscore',
		'handlebars',
		'service-communication/request',
		'service-communication/user',
		'sammy',
		'service-communication/login-out-register',
		'./notifications',
		'calendar/calendar',
		'extensions/date'
	],
	function($, _, Handlebars, request, currentUser, Sammy, logIn, notify, calendar) {

		var mainContainer = $('#main-container'),
			navigationContainer = $('#navigation-container');

		currentUser.initPromise
			.then(function(res) {
				console.log('filling navigation');
				fillnavigation(navigationContainer, currentUser);
				if (currentUser.isLoggedIn) {
					window.location.hash = '#/calendar';
				}
			})
			.catch(function(err) {
				notify.printError(err);
			});

		var sammyApp = Sammy('#main-container', function() {
			this.get('#/', function() {
				this.redirect('#/home');
			});

			this.get('#/home', function() {
				var self = this;
				mainContainer.children().detach();
				fillnavigation(navigationContainer, currentUser);
				if (currentUser.isLoggedIn) {
					self.redirect('#/calendar');
				}
			});

			this.get('#/register', function() {
				if (currentUser.isLoggedIn) {
					this.redirect('#/home');
				} else {
					createNewAccount();
				}
			});

			this.get('#/login', function() {
				if (currentUser.isLoggedIn) {
					this.redirect('#/home');
				} else {
					logInForm();
				}
			});

			this.get('#/guest', function() {
				logIn.guestMode();
			});

			this.get('#/logout', function() {
				var self = this;
				logIn.signOut()
					.then(function() {
						self.redirect('#/home');
					})
					.catch(function(err) {
						notify.printError(err);
					});
			});

			this.get('#/calendar', function() {
				if (!currentUser.isLoggedIn) {
					this.redirect('#/home');
				}
				calendar.appendTo(mainContainer);
			});
		});

		sammyApp.run('#/');

		function monthView() {
			//TODO
		}

		function logInForm() {
			request.GET('forms', {
				filter: {
					name: 'login'
				},
				fields: {
					template: 1,
					Id: 0
				}
			}).then(function(result) {
				logIn.logIn(result[0].template, mainContainer);
			}).catch(function(err) {
				notify.printError(err);
			});
		}

		function createNewAccount() {
			request.GET('forms', {
				filter: {
					name: 'registration'
				},
				fields: {
					template: 1,
					Id: 0
				}
			}).then(function(result) {
				logIn.register(result[0].template, mainContainer);
			});
		}

		function fillnavigation(container, params) {
			var sorce = $('#navigation-template').html();
			var template = Handlebars.compile(sorce);
			var result = $(template(params));

			container
				.empty()
				.append(result);
		}
	});