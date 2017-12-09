# p2n [![Build Status](https://travis-ci.org/jamestalmage/p2n.svg?branch=master)](https://travis-ci.org/jamestalmage/p2n) [![codecov](https://codecov.io/gh/jamestalmage/p2n/badge.svg?branch=master)](https://codecov.io/gh/jamestalmage/p2n?branch=master)

> A very lightweight way to nodeify a promise.

"Nodebacks", "Errorbacks", or just "error first callbacks" -- whatever you want to call them. It seems relatively straightforward to convert from a promise to a node style callback:

```js
promise.then(
	result => cb(null, result),
	err => cb(err)
);
```

However, if `cb` throws, that results in an unhandled promise rejection. The error will not bubble up and crash the node process, or hit the browser console in older browsers. This breaks the typical contract of node callbacks, and can lead to hidden, hard to find bugs. The tendency of Promises to silently swallow errors earned them plenty of detractors in the Node community.

This module handles all the above problems, and works on Node and in the browser. It uses `setImmediate` in Node to throw errors outside the promise stack, and falls back to `setTimeout` in the browser. This is the exact same mechanism Promise libraries like `Bluebird` use to "nodeify" promises, but without the bulk of those huge libraries.
 
Note: If you are running this in the browser, and throwing many, many errors each second, you *may* want to [polyfill `setImmediate`](https://github.com/YuzuJS/setImmediate). We avoid including it by default because it adds unnecessary bulk to your browser bundle if errors are infrequent.

## Install

```
$ npm install p2n
```


## Usage

```js
const p2n = require('p2n');

// allows for a flexible api, users can choose promises or callbacks. 
function myApi(args, optionalNodeback) {
	// ...
	
	// returns "somePromise", and attaches the callback if was provided.
	return p2n(somePromise, optionalNodeback);
}
```


## API

### p2n(promise, [callback])

Returns the promise (useful for chaining). 

#### promise

Type: `Promise`

The promise to attach the callback to.

#### optionalCallback

Type: `function(err, result)`<br>
Optional

If provided, the callback will be called when the Promise resolves.


## License

MIT © [James Talmage](https://github.com/jamestalmage)
