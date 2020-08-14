const symbol1 = Symbol('foo');
const symbol2 = Symbol('bar');

const item = {
	regexp: /foo[\\\/](?=\d)/,
	array: [
		new Date(),
		new Date(100),
		'invalid date',
		Date.now(),
	],
	map: new Map([
		[{ foo: 1 }, { a: 1 }],
		[{ bar: 2 }, { b: 2 }],
	]),
	set: new Set([
		{ foo: 1 }, { bar: 2 }, [1, 2, 3]
	]),
	int8arr: new Int8Array([4, 5, 6]),
	buffer: Buffer.from('hello'),
	symbol1: symbol1,
	symbol2: symbol2,
	[symbol1]: 'hello',
	[symbol2]: [1, 2, 3, 4]
}

Object.defineProperty(item, 'hidden1', {
	enumerable: false,
	value: 'found me'
});

Object.defineProperty(item, 'hidden2', {
	enumerable: false,
	value: [1, 2, 3]
});

Object.defineProperty(item, 'secret', {
	enumerable: false,
	get() {
		return 'password';
	}
});

module.exports = item;
