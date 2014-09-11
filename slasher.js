var slasher = (function() {
	var events = require('events'),
			request = require('request'),
			cheerio = require('cheerio'),
			str 		= require('string'),
			methods;

	methods = {
		Slash: function() {
			events.EventEmitter.call(this);

			this.slashIt = function(url) {
				var _this = this;
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var	bodyStripped = str(body).stripTags('blockquote', 'strong', 'em', 'a', 'ul', 'li', 'ol').s,
								$ 			  	 = cheerio.load(bodyStripped),
								$htmlBody;

						$('script, style, iframe, header, footer, noscript, br, img').remove();
						$htmlBody = $('body');

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

						_this.emit('slashed', foundText);
					} else {
						_this.emit('requestError');
					}
				});
			}
		}
	}

	methods.Slash.prototype = Object.create(events.EventEmitter.prototype);

	return methods;
})();

module.exports = slasher;
