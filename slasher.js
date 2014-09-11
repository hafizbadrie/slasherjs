var slasher = (function() {
	var request = require('request'),
		cheerio = require('cheerio'),
		str 		= require('string'),
		methods;

	methods = {
		slashIt: function(url) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log('URL: ' + url);

					var	bodyStripped = str(body).stripTags('blockquote', 'strong', 'em', 'a', 'ul', 'li', 'ol').s,
							$ 			  	 = cheerio.load(bodyStripped),
							$htmlBody;

					$('script, style, iframe, header, footer, noscript, br, img').remove();
					$htmlBody = $('body');

					// console.log($htmlBody.html());

					var children 	 	= $htmlBody.children(),
							pChildren  	= $htmlBody.children('p'),
							pChildCount = pChildren.length,
							childCount 	= children.length,
							done 			 	= false,
							foundText  	= '';

					while(!done) {
						var topIdx   	 = 0,
								textLength = 0;

						if (pChildCount > 0) {
							for(var i=0; i<pChildCount; i++) {
								var pChild = $(pChildren[i]);
								foundText += pChild.text() + '\n';
							}

							done = true;
						} else {
							for(var i=0; i<childCount; i++) {
								var content = $(children[i]),
										text 	 	= content.text().replace(/\s/g, '');

								if (textLength < text.length) {
									textLength = text.length;
									topIdx = i;
								}
							}

							var child = $(children[topIdx]);

							children 		= child.children();
							pChildren 	= child.children('p');
							pChildCount = pChildren.length;
							childCount 	= child.children().length;
							if (childCount === 0) {
								foundText = child.text();
								done = true;
							}
						}
					}

					console.log(foundText);

					console.log('============================================================');
					console.log('');

				} else {
					return false;
				}
			});
		}
	};

	return methods;

})();

module.exports = slasher;
