const request = require('request');

var MidofficeApiError = require('./error');

/**
 * MidofficeApi Class
 *
 * @param {Object} config
 * @constructor
 */
function MidofficeApi(config) {
	if ('object' !== typeof(config)) {
		throw new MidofficeApiError({
			code: 'ConfigError',
			message: 'Config must be an object.'
		});
	}

	if (!config.hasOwnProperty('url')) {
		throw new MidofficeApiError({
			code: 'ConfigError',
			message: 'Midoffice URL is missing in config. Please provide the "url" property.'
		});
	}

	if (!config.hasOwnProperty('auth')) {
		throw new MidofficeApiError({
			code: 'ConfigError',
			message: 'Authentication is missing in config. Please provide the "auth" property.'
		});
	}

	this.auth = config.auth;
	this.url = config.url;
}

/**
 * Requests a single endpoint.
 *
 * @param {String} url
 * @param {Object} options
 * @returns {Promise}
 */
MidofficeApi.prototype.request = function (url, options) {
	options = options || {};

	if (options.query) {
		options.query.filter = JSON.stringify(options.query.filter);
	}

	var api = this;

	return new Promise(function (resolve, reject) {
		request({
			method: options.method || 'GET',
			uri: api.url + url,
			json: options.data,
			qs: options.query,
			auth: {
				user: api.auth.key,
				pass: api.auth.secret
			}
		}, function (e, res, body) {
			if (e) {
				return reject(e);
			}

			resolve(JSON.parse(body));
		});
	});
};

module.exports = function (options) {
	return new MidofficeApi(options);
};