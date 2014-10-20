var slasher = (function() {
	var events = require('events'),
			request = require('request'),
			cheerio = require('cheerio'),
			str 		= require('string'),
			methods;

	methods = {
		Slash: function() {
			events.EventEmitter.call(this);
			var urlSet 		 = [],
					contentLib = {},
					countArr 	 = [];

			this.isEmptyUrlSet = function() {
				return (urlSet.length === 0);
			}

			this.addUrl = function(url) {
				urlSet.push(url);
			}

			this.pushContent = function(content, contentTrimmed) {
				var trimmedLength = contentTrimmed.length;
				countArr.push(trimmedLength);
				contentLib[trimmedLength] = content;
			}

			this.recurslash = function($, children) {
				for(var i=0; i<children.length; i++) {
					var $child = $(children[i]);

					if ($child.children('p').length > 0) {
						var pChildren = $child.children('p'),
								pContent 	= '',
								pTrimmed  = '';
						for(var j=0; j<pChildren.length; j++) {
							pContent += $(pChildren[j]).text() + '\n';
						}

						pTrimmed = pContent.replace(/\s/g, '');

						this.pushContent(pContent, pTrimmed);
					} 

					if ($child.children().length > 0) {
						this.recurslash($, $child.children());
					} else {
						if ($child.text() !== '') {
							var content = $child.text(),
									trimmed = content.replace(/\s/g, '');

							this.pushContent(content, trimmed);
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
						$('script, style, iframe, header, footer, noscript, br, img').remove();
						$htmlBody = $('body');

						var children 	 	= $htmlBody.children(),
								foundText  	= '';

						_this.recurslash($, children);

						foundText = _this.findArticle();

						var endTime  = new Date().getMilliseconds(),
								diffTime = endTime - startTime;

						console.log('Elapsed time: ' + diffTime.toString() + ' ms');

						callback('ok', foundText);
					} catch(ex) {
						callback('error', ex);
					}
				});

			};

			this.findArticle = function() {
				var article = '';

				if (countArr.length > 0) {
					countArr.sort(function(a, b) {
						return b - a;
					});
					article = contentLib[countArr[0]];
				}

				return article;
			}

			this.isValidUrl = function(url) {
				var urlMod = require('url'),
						parsed = urlMod.parse(url);

				return (parsed.protocol !== null && parsed.slashes !== null && parsed.host !== null && parsed.hostname !== null);
			}

			this.grabHTML = function(url, callback) {
				request(url, callback);
			}

			this.slashIt = function() {
				var _this = this;

				urlSet.forEach(function(url, idx, array) {
					if (_this.isValidUrl(url)) {
						_this.grabHTML(url, function(error, response, body) {
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
				});
			}
		}
	}

	methods.Slash.prototype = Object.create(events.EventEmitter.prototype);

	return methods;
})();

module.exports = slasher;
