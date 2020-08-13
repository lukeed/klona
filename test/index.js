import { suite } from 'uvu';
import * as assert from 'assert';
import { klona } from '../src';

const API = suite('exports');

API('should export a function', () => {
	assert.equal(typeof klona, 'function');
});

API.run();

// ---

const Arrays = suite('Arrays');

Arrays('flat', () => {
	const input = ['foo', 'bar', 'baz'];
	const output = klona(input);

	assert.deepEqual(input, output);

	output[1] = 'hello';
	assert.notEqual(input[1], 'hello');
});

Arrays('nested', () => {
	const input = ['foo', [1, 2, ['hello', 'world'], 3], 'bar', 'baz'];
	const output = klona(input);

	assert.deepEqual(input, output);

	output[1][2][0] = 'howdy';
	assert.equal(input[1][2][0], 'hello');

	output[1] = 'hello';
	assert.notEqual(input[1], 'hello');
});

Arrays.run();

// ---

const Booleans = suite('Boolean');

Booleans('boolean', () => {
	const input = true;
	let output = klona(input);

	assert.deepEqual(input, output);

	output = false;
	assert.equal(input, true);
});

Booleans.run();

// ---

const Classes = suite('class');

Classes('class', () => {
	class Foobar {}
	const input = new Foobar();
	const output = klona(input);

	assert.deepEqual(input, output);
	assert.equal(input.constructor, output.constructor);
	assert.equal(output.constructor.name, 'Foobar');

	output.foobar = 123;
	// @ts-ignore
	assert.notEqual(input.foobar, 123);
});

// @see https://github.com/lukeed/klona/issues/14
Classes('prototype', () => {
	function Test () {}
	Test.prototype.val = 42;

	const input = new Test();
	const output = klona(input);

	assert.deepEqual(input, output);

	assert.deepEqual(output.constructor, Test);
	assert.deepEqual(output.__proto__, { val: 42 });
	assert.deepEqual(output, {});
	assert.equal(output.val, 42);
});

Classes('constructor properties', () => {
	function Test (num) {
		this.value = num;
	}

	Test.prototype.val = 42;

	const input = new Test(123);
	const output = klona(input);

	assert.deepEqual(input, output);
	assert.deepEqual(output.constructor, Test);
	assert.deepEqual(output.__proto__, { val: 42 });
	assert.equal(output.value, 123);
	assert.equal(output.val, 42);
});

Classes('constructor properties :: class', () => {
	class Test {
		constructor(num) {
			this.value = num;
		}
	}

	Test.prototype.val = 42;

	const input = new Test(123);
	const output = klona(input);

	assert.deepEqual(input, output);
	assert.deepEqual(output.constructor, Test);
	assert.deepEqual(output.__proto__, { val: 42 });

	assert.equal(output.value, 123);
	assert.equal(output.val, 42);
});

Classes('constructor properties :: defaults', () => {
	class Test {
		constructor(num = 123) {
			this.value = num;
		}
	}

	const input = new Test(456);
	const output = klona(input);

	assert.deepEqual(input, output);
	assert.equal(output.value, 456);
});

Classes('accessors', () => {
	class Test {
		get val() {
			return 42;
		}
	}

	const input = new Test();
	const output = klona(input);

	assert.deepEqual(input, output);
	assert.deepEqual(output.constructor, Test);
	assert.deepEqual(output.__proto__, {});

	assert.deepEqual(
		// @ts-ignore
		Object.getOwnPropertyDescriptor(input.__proto__, 'val'),
		Object.getOwnPropertyDescriptor(output.__proto__, 'val'),
	);

	assert.equal(output.val, 42);
})

Classes.run();

// ---

const Pollution = suite('pollution');

// @see https://snyk.io/vuln/SNYK-JS-LODASH-450202
Pollution('constructor', () => {
	const payload = '{"constructor":{"prototype":{"a0":true}}}';

	const input = JSON.parse(payload);
	const output = klona(input);

	assert.equal(
		JSON.stringify(output),
		payload
	);

	assert.notEqual(({})['a0'], true, 'Safe POJO');
	assert.notEqual(new Object()['a0'], true, 'Safe Object');

	assert.notEqual(input['a0'], true, 'Safe input');
	assert.notEqual(output['a0'], true, 'Safe output');
});

// @see https://snyk.io/vuln/SNYK-JS-LODASH-450202
Pollution('__proto__', () => {
	const payload = '{"__proto__":{"a0":true}}';
	const input = JSON.parse(payload);
	const output = klona(input);

	assert.equal(
		JSON.stringify(output),
		payload
	);

	assert.notEqual(({})['a0'], true, 'Safe POJO');
	assert.notEqual(new Object()['a0'], true, 'Safe Object');

	assert.notEqual(input['a0'], true, 'Safe input');
	assert.notEqual(output['a0'], true, 'Safe output');
});

Pollution('prototype', () => {
	const payload = '{"prototype":{"hello":"world"}}';
	const input = JSON.parse(payload);
	const output = klona(input);

	assert.equal(
		JSON.stringify(output),
		payload
	);

	assert.notEqual(({})['hello'], 'world', 'Safe POJO');
	assert.notEqual(new Object()['hello'], 'world', 'Safe Object');

	assert.notEqual(input['hello'], 'world', 'Safe input');
	assert.notEqual(output['hello'], 'world', 'Safe output');
});

Pollution.run();

// ---

const Dates = suite('Date');

Dates('date', () => {
	const input = new Date;
	const output = klona(input);
	const original = input.toString();

	assert.deepEqual(input, output);

	output.setDate('foobar123');
	assert.equal(output.toString(), 'Invalid Date');
	assert.equal(input.toString(), original);
});

Dates.run();

// ---

const Functions = suite('Function');

Functions('function', () => {
	let input = () => {};
	let output = klona(input);
	let original = input.toString();

	assert.deepEqual(input, output);

	input = () => 123;
	assert.equal(output.toString(), original);

	output = () => 456;
	assert.equal(input.toString(), '() => 123');
});

Functions.run();

// ---

const Maps = suite('Map');

Maps('flat', () => {
	const input = new Map();
	const output = klona(input);

	assert.deepEqual(input, output);

	output.set('hello', 'world');
	assert.equal(input.get('hello'), undefined);

	input.set('foo', 'bar');
	assert.equal(output.get('foo'), undefined);
});

Maps('nested', () => {
	const input = new Map([
		['foo', { a: 1 }],
		['bar', [1, 2, 3]],
	]);
	const output = klona(input);

	const foo = output.get('foo');
	foo.b = 2;
	foo.a++;

	assert.deepEqual(input.get('foo'), { a: 1 });
	assert.deepEqual(output.get('foo'), { a: 2, b: 2 });

	output.get('bar').push(4, 5, 6);
	assert.deepEqual(input.get('bar'), [1, 2, 3]);
	assert.deepEqual(output.get('bar'), [1, 2, 3, 4, 5, 6]);
});

Maps('nested :: keys', () => {
	const input = new Map([
		[{ foo:1 }, { a: 1 }]
	]);

	const output = klona(input);
	assert.deepEqual(input, output);

	[...output.keys()][0].bar = 2;

	assert.deepEqual([...input.keys()][0], { foo:1 });
	assert.deepEqual([...output.keys()][0], { foo:1, bar:2 });
});

Maps.run();

// ---

const Null = suite('null');

Null('null', () => {
	let input = null;
	let output = klona(input);

	assert.deepEqual(input, output);

	output = 1;
	assert.equal(input, null);

	input = 123;
	assert.equal(output, 1);
});

Null.run();

// ---

const Numbers = suite('Number');

Numbers('number', () => {
	let input = 123;
	let output = klona(input);

	assert.deepEqual(input, output);

	output++;
	assert.equal(input, 123);

	input += 100;
	assert.equal(output, 124);
});

Numbers.run();

// ---

const Objects = suite('Object');

Objects('flat', () => {
	const input = { foo:1, bar:2, baz:3 };
	const output = klona(input);

	assert.deepEqual(input, output);

	output.foo++;
	assert.equal(input.foo, 1);

	output.bar = 'hello';
	assert.equal(input.bar, 2);
});

Objects('nested', () => {
	const input = {
		foo: 1,
		bar: {
			a: 2,
			b: ['hello', 'world'],
			c: [{ hello: 1, world: 2 }]
		},
		baz: 3
	};

	const output = klona(input);

	assert.equal(
		JSON.stringify(input),
		JSON.stringify(output)
	);

	output.bar.a = 11;
	assert.equal(input.bar.a, 2);

	output.bar.b[1] = 'mundo';
	assert.equal(input.bar.b[1], 'world');

	output.bar.c[0].hello = 99;
	assert.equal(input.bar.c[0].hello, 1);
});

Objects.run();

// ---

const RegExps = suite('RegExp');

RegExps('basic', () => {
	const input = /foo/gi;
	const output = klona(input);

	assert.deepEqual(input, output);

	output.exec('foofoofoo');
	assert.equal(output.lastIndex, 3);
	assert.equal(input.lastIndex, 0);
});

RegExps('state', () => {
	const input = /foo/gi;
	input.exec('foofoofoo');
	const index = input.lastIndex;

	const output = klona(input);

	assert.deepEqual(input, output);

	assert.equal(index, 3);
	assert.equal(input.lastIndex, index);
	assert.equal(output.lastIndex, index);
});

RegExps.run();

// ---

const Sets = suite('Set');

Sets('flat', () => {
	const input = new Set('hello');
	const output = klona(input);

	assert.deepEqual(input, output);

	output.add('world');
	assert.equal(input.has('world'), false);

	input.add('foobar');
	assert.equal(output.has('foobar'), false);
});

Sets('nested', () => {
	const input = new Set([{ foo: 123 }]);
	const output = klona(input);

	assert.deepEqual(input, output);

	const [obj] = [...output.keys()];
	obj.bar = 456;
	obj.foo++;

	const [item] = [...input.keys()];
	assert.deepEqual(item, { foo: 123 });
});

Sets.run();

// ---


const Strings = suite('String');

Strings('string', () => {
	let input = 'hello';
	let output = klona(input);

	assert.equal(input, output);

	output += ' world';
	assert.equal(input, 'hello');

	input += '123';
	assert.equal(output, 'hello world');
});

Strings.run();

// ---

const TypedArrays = suite('TypedArray');
TypedArrays('buffer', () => {
	const input = Buffer.from('asd');
	const output = klona(input);

	assert.deepEqual(input, output);

	output.write('foobar');
	assert.equal(input.toString(), 'asd');

	output[1] = 11;
	assert.notEqual(input[1], output[1]);

	const current = output.toString();
	input.write('hello');
	assert.equal(output.toString(), current);
});

TypedArrays('uint16array', () => {
	const input = new Int16Array([42]);
	const output = klona(input);

	assert.deepEqual(input, output);

	output[1] = 42;
	assert.equal(input[1], undefined);

	input[0] = 0;
	assert.equal(output[0], 42);
});

TypedArrays('int32array', () => {
	const buf = new ArrayBuffer(8);
	const input = new Int32Array(buf);
	const output = klona(input);

	assert.deepEqual(input, output);

	output[1] = 42;
	assert.equal(input[1], 0);

	input[0] = 22;
	assert.equal(output[0], 0);
});

TypedArrays.run();
