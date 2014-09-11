var slasher = require('./slasher'),
		urlList	= require('./urls.json'),
		urls 		= urlList['url'];

urls.forEach(function(url, index, array) {
	slasher.slashIt(url);
});
