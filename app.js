var slasher = require('./slasher'),
		urlList	= require('./urls.json'),
		urls 		= urlList['url'],
		slash 	= new slasher.Slash();

slash.on('slashed', function(content) {
	console.log(content);
});

urls.forEach(function(url, index, array) {
	console.log(url);
	slash.slashIt(url);
});
