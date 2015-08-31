var requirejs = require('requirejs');
var expect = require('chai').expect;
var jsdom = require('jsdom');
var jq = require('jquery');

requirejs.config({
	baseUrl: 'scripts',
	nodeRequire: 'require',
	paths: {
		jquery: 'libs/jquery-2.1.4',
		underscore: 'libs/underscore'
	}
});

// Storage Mock
function storageMock() {
	var storage = {};

	return {
		setItem: function(key, value) {
			storage[key] = value || '';
		},
		getItem: function(key) {
			return storage[key];
		},
		removeItem: function(key) {
			delete storage[key];
		},
		get length() {
			return Object.keys(storage).length;
		},
		key: function(i) {
			var keys = Object.keys(storage);
			return keys[i] || null;
		}
	};
}

describe('Database', function() {

	var DB,
		Day,
		Note,
		List,
		testDays = [];

	before(function(done) {
		jsdom.env({
			html: '',
			done: function(errors, window) {
				global.window = window;
				global.document = window.document;
				global.$ = jq(window);
				global.localStorage = storageMock();
				Object.keys(window)
					.filter(function(prop) {
						return prop.toLowerCase().indexOf('html') >= 0;
					}).forEach(function(prop) {
						global[prop] = window[prop];
					});
			}
		});

		requirejs([
				'calendar/database',
				'calendar/day',
				'content-types/note',
				'content-types/list'
			],
			function(db, day, note, list) {

				DB = db;
				Day = day;
				Note = note;
				List = list;
				done();

				(function() {
					var day,
						month,
						year,
						selectedDate,
						currentDay,
						dayNote,
						dayList;

					for (year = 2013; year < 2015; year += 1) {
						for (month = 6; month < 11; month += 1) {
							for (day = 1; day < 30; day += 3) {

								selectedDate = new Date(year, month, day);
								currentDay = new Day(selectedDate);

								dayNote = new Note(currentDay.name,
									'kupih ' + currentDay.number + ' televizora');

								dayList = new List('igrachki', [
									'avtomat',
									'kantar',
									'triygylnik',
									'xlqb'
								]);

								currentDay
									.addContent(dayNote)
									.addContent(dayList);

								testDays.push(currentDay);
							}
						}
					}
				})();

			}
		);
	});

	it('addDay() should add one day to database', function() {
		expect(DB.getAll().length).to.equal(0);

		DB.addDay(testDays[0]);
		expect(DB.getAll().length).to.equal(1);
		expect(DB.getAll()).to.include(testDays[0]);
	});

	it('clear() should remove all content from DB', function() {
		expect(DB.getAll().length).to.equal(1);

		DB.clear();
		expect(DB.getAll().length).to.equal(0);
	});

	it('getDaysForThisMonth', function() {
		// body...
	});

	// $('#main-container').calendar();
	// DB = db;
	// Day = day;
	// Note = note;
	// Content = content;

	// obj = {
	// 	title: 'belejka',
	// 	message: 'imash 6'
	// };

	// nota = new Note(obj);
	// misho = new Day(new Date());
	// misho.addContent(nota);
});