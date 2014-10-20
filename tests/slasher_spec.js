describe("Slasher", function() {
	var Slasher = require('../slasher.js'),
			slasher;

	beforeEach(function() {
		slasher = new Slasher.Slash();
	});

	it("should have empty urlSet", function() {
		expect(slasher.isEmptyUrlSet()).toBe(true);

		slasher.addUrl('http://www.thejakartaglobe.com/news/press-scrutiny-kpks-jero-probe/');
		expect(slasher.isEmptyUrlSet()).toBe(false);
	});

	it("should validate url", function() {
		expect(slasher.isValidUrl('localhost')).toBe(false);
		expect(slasher.isValidUrl('http:/localhost')).toBe(false);
		expect(slasher.isValidUrl('www.thejakartapost.com')).toBe(false);
		expect(slasher.isValidUrl('http://www.thejakartapost.com')).toBe(true);
		expect(slasher.isValidUrl('https://www.thejakartapost.com')).toBe(true);
	});

	it("should grab HTML code from a URL", function(done) {
		slasher.grabHTML('http://www.thejakartaglobe.com/news/press-scrutiny-kpks-jero-probe/', function(error, response, body) {
			expect(body).not.toBe(null);
			expect(response.statusCode).toEqual(200);
			done();
		});
	});

	it("should grab HTML code from a URL and throws error", function(done) {
		slasher.grabHTML('http:/localhost', function(error, response, body) {
			expect(response.statusCode).not.toEqual(200);
			done();
		});
	});

});