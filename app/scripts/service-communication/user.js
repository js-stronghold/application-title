define('user',['libs/everlive/src/everlive.all', 'calendar/database'], function(Everlive, database){
	var apiKey = 'Ens6YHzXbKZ7ymKx';
	var el = new Everlive(apiKey);
	var query = new Everlive.Query();

	var usersData = el.data('User');



		return {
			createNewUser: function(username, password){
				var user = {
					password: password,
					name: username,
					daysWithContent: []
				};

				usersData.create(user)
				.then(function(){
					console.log('User created!');
				})
				.done();
			},
			addDayContentToUser: function(currentUsername, day){
				var tobepushed = database.prepareForLocalStorage(day, true);

				var attributes = {
				    "$push": {
				        "daysWithContent": tobepushed
				    }
				};

				var filter = {
				    'Id': "03f99f10-526a-11e5-ada2-a931b865de90"
				};

				usersData.rawUpdate(attributes, filter);
			},
			getUserContent: function(username, password){
				var searchingUser = {
					'name': username,
					'password' : password
				};
				return usersData.get(searchingUser).done().result;
			}


		}


	});
