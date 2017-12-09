import test from 'ava';
import td from 'testdouble';
import global from 'global/window';
import m from '.';

test('callback is called with result of a promise', async t => {
	const cb = td.function();
	const promise = Promise.resolve('foo');

	t.is(m(promise, cb), promise);

	await promise;

	td.verify(cb(null, 'foo'));
	t.pass();
});

test('callback is called with the rejection of a promise', async t => {
	t.pass();
	const cb = td.function();
	const error = new Error('foo');
	const promise = Promise.reject(error);

	t.is(m(promise, cb), promise);

	await promise.catch(() => {});

	td.verify(cb(error), {ignoreExtraArgs: true});
	t.pass();
});

test('if callback throws, error is not swallowed by promise', async t => {
	const originalSetImmediate = global.setImmediate;
	try {
		global.setImmediate = td.function('setImmediate');
		const cb = td.function('cb');
		const captor = td.matchers.captor();
		const error = new Error('foo');
		const promise = Promise.resolve('foo');

		td.when(cb(), {ignoreExtraArgs: true}).thenThrow(error);

		t.is(m(promise, cb), promise);

		await promise;

		td.verify(global.setImmediate(captor.capture(), 0));

		const thrown = t.throws(() => captor.value());

		t.is(thrown, error);
	} finally {
		global.setImmediate = originalSetImmediate;
	}
});
