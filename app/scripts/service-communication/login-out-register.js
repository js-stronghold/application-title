define([
		'service-communication/request',
		'service-communication/user',
		'interface/notifications',
		'jquery'
	],
	function(request, currentUser, notify, $) {

		function initForm(html, container, callback) {
			var wrapper = $('<div />')
				.addClass('register-form ui-widget-content ui-corner-all')
				.html(html)
				.fadeIn(500);

			container
				.empty()
				.append(wrapper)
				.find('#username').focus();

			$(wrapper).find('form').on('submit', function(evt) {
				var $this = $(this),
					username = $this.find('#username').val(),
					pass = $this.find('#password').val(),
					repeatPass = $this.find('#repeat-password').val();

				evt.preventDefault();
				evt.stopPropagation();

				callback(username, pass, repeatPass);
			});
		}

		function register(username, password, repeatPassword) {	
			if (username.length < 3) {
				throw new Error('Username must be longer than 2 symbols');
			} else if (password.length < 5) {
				throw new Error('Password must be longer than 4 symbols');
			} else if (password !== repeatPassword) {
				throw new Error('The password and the repeat password are not matching');
			}

			request.POST('Users', {
					data: {
						Username: username,
						Password: password,
						DisplayName: username
					}
				}).then(function() {
					notify.printSuccess('Registered succesfully!');
					logIn(username, password);
				})
				.catch(function(error) {
					notify.printError(error);
				});
		}

		function logIn(username, password) {
			if (!username) {
				throw new Error('Username cannot be empty');
			} else if (!password) {
				throw new Error('Password cannot be empty');
			}

			request.POST('oauth/token', {
					// contentType: 'application/json',
					data: {
						username: username,
						password: password,
						grant_type: 'password'
					}
				})
				.then(function(response) {
					localStorage.setItem('access_token', response.access_token);
					localStorage.setItem('principal_id', response.principal_id);
					console.log(response);
					return currentUser.init(); // return serves to chain prommises
				})
				.then(goToHome)
				.catch(function(error) {
					notify.printError(error);
				});
		}

		function signOut() {
			return request.GET('oauth/logout', {
					authorisation: 'Bearer ' + localStorage.getItem('access_token')
				})
				.then(currentUser.switchLoggedState)
				.then(localStorage.removeItem('access_token'))
				.then(localStorage.removeItem('principal_id'))
				.catch(function(err) {
					notify.printError(err);
				});
		}

		function goToHome() {
			window.location.hash = '#/home';
		}

		// ############### Module Interface #######################
		return {
			register: function(html, container) {
				initForm(html, container, register);
			},

			logIn: function(html, container) {
				initForm(html, container, logIn);
			},

			signOut: signOut,

			guestMode: function() {
				logIn('guest', 'guest');
			}
		};
		// ########################################################

	});