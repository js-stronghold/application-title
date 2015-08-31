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

					for (year = 2013; year <= 2015; year += 1) {
						for (month = 0; month <= 11; month += 1) {
							for (day = 1; day < 30; day += 6) {

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

	it('addDay() should add one day to DB', function() {
		expect(DB.getAll().length).to.equal(0);

		DB.addDay(testDays[0]);
		expect(DB.getAll().length).to.equal(1);
		expect(DB.getAll()).to.include(testDays[0]);
		DB.clear();
	});

	it('addDay() should throw when there is other day with the same date in DB', function () {
		// body...
	});

	it('DB to work with a lot of days', function() {
		testDays.forEach(DB.addDay);
		expect(DB.getAll().length).to.be.above(150);
	});

	it('removeDay() to remove a day by given date', function() {
		var theDate = new Date(2013, 0, 1),
			allDaysBefore = DB.getAll(),
			expectedToBeRemoved = allDaysBefore[0],
			actualRemoved = DB.removeDay(theDate),
			allDaysAfter = DB.getAll();

		expect(allDaysAfter.length).to.equal(allDaysBefore.length - 1);
		expect(expectedToBeRemoved).to.eql(actualRemoved);
		expect(allDaysAfter).to.not.include(expectedToBeRemoved);
	});

	it('removeDay() to remove a day by reference', function() {
		var theRemoved = testDays[100],
			allDaysBefore = DB.getAll(),
			actualRemoved = DB.removeDay(theRemoved),
			allDaysAfter = DB.getAll();

		expect(allDaysAfter.length).to.equal(allDaysBefore.length - 1);
		expect(theRemoved).to.eql(actualRemoved);
		expect(allDaysAfter).to.not.include(theRemoved);
	});

	it('clear() should remove all content from DB', function() {
		expect(DB.getAll().length).to.be.above(10);

		DB.clear();
		expect(DB.getAll().length).to.equal(0);
	});

	describe('getDays functions', function() {
		before(function() {
			testDays.forEach(DB.addDay);
		});

		after(function() {
			DB.clear();
		});

		it('getDaysForThisMonth() should return only the days for the given month', function() {
			var theMonth = new Date(2015, 7),
				days = DB.getDaysForThisMonth(theMonth);

			expect(days.length).to.equal(5);
			days.forEach(function(day) {
				expect(day.date.getMonth()).to.equal(7);
			});
		});

		it('getDaysForThisMonth() should return emptyArray if there isn\'t content for the given month', function() {
			var theMonth = new Date(2225, 7),
				days = DB.getDaysForThisMonth(theMonth);

			expect(days.length).to.equal(0);
		});

		it('getDaysForNextMonth() should return results for next year january when called for the last month of the year', function() {
			var theMonth = new Date(2014, 11),
				days = DB.getDaysForNextMonth(theMonth);

			expect(days.length).to.equal(5);
			days.forEach(function(day) {
				expect(day.date.getMonth()).to.equal(0);
				expect(day.date.getFullYear()).to.equal(2015);
			});
		});

		it('getDaysForPrevMonth() should return results for previous year december when called for the first month of the year', function() {
			var theMonth = new Date(2014, 0),
				days = DB.getDaysForPrevMonth(theMonth);

			expect(days.length).to.equal(5);
			days.forEach(function(day) {
				expect(day.date.getMonth()).to.equal(11);
				expect(day.date.getFullYear()).to.equal(2013);
			});
		});
	});

	describe('localStorage', function() {
		afterEach(function() {
			DB.clear();
		});

		it('expect item "daysWithEvents" to exist in localStorage when there are days in DB', function() {
			var days = testDays.slice(10, 20);
			days.forEach(DB.addDay);

			expect(localStorage.getItem('daysWithEvents')).to.not.equal(undefined);
		});

		it('restoring days from localStorage should create the correct days', function() {
			var days = testDays.slice(10, 20),
				daysFromLS;

			days.forEach(DB.addDay);

			DB.clearWithoutLS();
			expect(DB.getAll().length).to.equal(0);

			DB.reloadFromLS();
			daysFromLS = DB.getAll();
			expect(daysFromLS.length).to.equal(10);

			expect(_.isEqual(days, daysFromLS)).to.be.true;
		});

		it('expect DB.removeDay() to also remove the day from LS', function () {
			// implement
		});
	});
});