class Test {
	constructor(num = 123) {
		this.value = num;
		this.items = [1, 2, 3];
	}
	get number() {
		return this.value;
	}
}

module.exports = {
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
	custom: new Test(456),
	int8arr: new Int8Array([4, 5, 6]),
	dataview: new DataView(new ArrayBuffer(4)),
	buffer: Buffer.from('hello'),
}
