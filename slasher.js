var slasher = (function() {
	var events = require('events'),
			request = require('request'),
			cheerio = require('cheerio'),
			str 		= require('string'),
			methods;

	methods = {
		Slash: function() {
			events.EventEmitter.call(this);
			var contentLib = {},
					countArr 	 = [];

			this.recurslash = function($, children) {
				for(var i=0; i<children.length; i++) {
					var $child = $(children[i]);

					// console.log($child.text());
					// console.log('===============================');

					if ($child.children('p').length > 0) {
						var pChildren = $child.children('p'),
								pContent 	= '',
								pTrimmed  = '';
						for(var j=0; j<pChildren.length; j++) {
							pContent += $(pChildren[j]).text() + '\n';
						}

						pTrimmed = pContent.replace(/\s/g, '');
						countArr.push(pTrimmed.length);
						contentLib[pTrimmed.length] = pContent;
					} 

					if ($child.children().length > 0) {
						this.recurslash($, $child.children());
					} else {
						if ($child.text() !== '') {
							var content = $child.text(),
									trimmed = content.replace(/\s/g, '');
							countArr.push(trimmed.length);
							contentLib[trimmed.length] = content;
						}
					}
				}
			}

			this.slasher = function(htmlCode, callback) {
				var startTime = new Date().getMilliseconds();

				contentLib = {};
				countArr 	 = [];

				var	bodyStripped = str(htmlCode).stripTags('blockquote', 'strong', 'em', 'a', 'ul', 'li', 'ol').s,
						$ 			  	 = cheerio.load(bodyStripped),
						_this 			 = this,
						$htmlBody;

				process.nextTick(function() {
					try {
						var foundText = '';

						$('script, style, iframe, header, footer, noscript, br, img').remove();
						$htmlBody = $('body');

						var children 	 	= $htmlBody.children(),
								childCount 	= children.length,
								done 			 	= false,
								foundText  	= '';

						_this.recurslash($, children);

						// console.log(contentLib);

						if (countArr.length > 0) {
							countArr.sort(function(a, b) {
								return b - a;
							});
							foundText = contentLib[countArr[0]];
						}

						var endTime  = new Date().getMilliseconds(),
								diffTime = endTime - startTime;

						console.log('Elapsed time: ' + diffTime.toString() + ' ms');

						callback('ok', foundText);
					} catch(ex) {
						callback('error', ex);
					}
				});

			};

			this.slashIt = function(url) {
				var _this = this;
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						_this.slasher(body, function(status, foundText) {
							if (status === 'ok') {
								_this.emit('slashed', foundText);
							} else {
								_this.emit('error', foundText);
							}
						});
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
