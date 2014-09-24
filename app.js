var slasher = require('./lib/slasher'),
		urlList	= require('./urls.json'),
		urls 		= urlList['url'],
		slash 	= new slasher.Slash();

slash.on('slashed', function(content) {
	console.log(content);
});

slash.on('error', function(message) {
	console.log(message);
});

urls.forEach(function(url, index, array) {
	console.log(url);
	slash.addUrl(url);
});

slash.slashIt();
