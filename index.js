'use strict';
const global = require('global/window');

module.exports = function (promise, cb) {
	if (typeof cb === 'function') {
		const call = (err, result) => {
			try {
				cb(err, result);
			} catch (err) {
				(global.setImmediate || global.setTimeout)(() => {
					throw err;
				}, 0);
			}
		};

		promise.then(
			result => call(null, result),
			err => call(err)
		);
	}

	return promise;
};
