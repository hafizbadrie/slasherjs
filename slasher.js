var slasher = (function() {
	var request = require('request'),
		cheerio = require('cheerio'),
		str 		= require('string'),
		methods;

	methods = {
		slashIt: function(url) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var	bodyStripped = str(body).stripTags('blockquote', 'strong', 'em', 'a', 'ul', 'li', 'ol').s,
							$ 			  	 = cheerio.load(bodyStripped),
							$htmlBody;

					$('script, style, iframe, header, footer, noscript, br, img').remove();
					$htmlBody = $('body');

					// console.log($htmlBody.html());

					var children 	 = $htmlBody.children(),
							childCount = children.length,
							foundText  = '';

					while(childCount > 0) {
						var topIdx   	 = 0,
								textLength = 0;

						for(var i=0; i<childCount; i++) {
							var content = $(children[i]),
									text 	 	= content.text().replace(/\s/g, '');

							// console.log(text.length);
							// console.log(text);
							// console.log(children[i]);
							// console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
							// console.log('');

							if (textLength < text.length) {
								textLength = text.length;
								topIdx = i;
							}	
						}

						var child = $(children[topIdx]);

						// console.log(child.text());
						// console.log('======================================================');
						// console.log('');

						children = child.children();
						childCount = child.children().length;
						if (childCount === 0) {
							foundText = child.text();
						}
					}

					console.log(foundText);

				} else {
					return false;
				}
			});
		}
	};

	return methods;

})();

module.exports = slasher;
